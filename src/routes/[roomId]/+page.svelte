<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { io, Socket } from 'socket.io-client';
	import Video from '$lib/components/Video.svelte';
	import User from '../../lib/components/User.svelte';
	import { goto } from '$app/navigation';
	import PhoneIcon from '$lib/icons/PhoneIcon.svelte';
	import PhoneIcommingIcon from '../../lib/icons/PhoneIcommingIcon.svelte';
	import MicIcon from '../../lib/icons/MicIcon.svelte';
	import MicOffIcon from '../../lib/icons/MicOffIcon.svelte';
	import VideoOffIcon from '../../lib/icons/VideoOffIcon.svelte';
	import VideoOnIcon from '../../lib/icons/VideoOnIcon.svelte';
	// import ShareScreen from '../../lib/components/ShareScreen.svelte';
  
	import SharescreenOn from '$lib/icons/SharescreenOn.svelte';
	export let data;
	let users: string[] = [];
	let peer: RTCPeerConnection;
	let socket: Socket;
	let remoteUser: string;
	let currentUser: string;
	let userStream: MediaStream;
	let remoteStream: MediaStream;

	let isIncommingCall = false;
	let incommingPayload: any;

	// let isCallAccepted = false;

	let isUserCameraOn = true;
	let isUserMicOn = true;
	

	$: connectedUsers = users.filter((user) => user !== currentUser);

	onDestroy(() => {
		stopMediaTracks();
	});
	onMount(async () => {
		const stream = await navigator.mediaDevices.getUserMedia({
			video: true,
			audio: true
		});
		userStream = stream;
	});
	onMount(() => {
		socket = io();

		socket.on('connect', () => {
			currentUser = socket.id;
		});
		socket.emit('join-room', data.roomId);
		

		socket.on('users', (data) => {
			users = data;
			console.log("user---", users);
		});

		socket.on('user-joined', (userID) => {
			users = [...users, userID];
		});

		socket.on('user-left', (userID) => {
			users = users.filter((user) => user !== userID);
		});

		socket.on('offer', (data) => {
			isIncommingCall = true;
			incommingPayload = data;
			remoteUser = data.caller;
		});
		socket.on('answer', handleAnswer);
		socket.on('ice-candidate', handleNewICECandidateMsg);
		socket.on('end-call', handleRemoteCallEnd);
	});

	// const handleCall = (userID: string) => {
	// 	callUser(userID);
	// 	remoteUser = userID;
	// };
	function createPeer(userID: string) {
		const peer = new RTCPeerConnection({
			iceServers: [
				{
					urls: 'stun:stun.stunprotocol.org'
				},
				{
					urls: 'turn:numb.viagenie.ca',
					credential: 'muazkh',
					username: 'webrtc@live.com'
				}
			]
		});

		peer.onicecandidate = handleICECandidateEvent;
		peer.ontrack = handleTrackEvent;
		peer.onnegotiationneeded = () => handleNegotiationNeededEvent(userID);

		return peer;
	}

	function callUser(userID: string) {
		peer = createPeer(userID);
		userStream.getTracks().forEach((track) => peer.addTrack(track, userStream));
	}

	function handleNegotiationNeededEvent(userID: string) {
		peer
			.createOffer()
			.then((offer) => {
				console.log(offer);
				return peer.setLocalDescription(offer);
			})
			.then(() => {
				const payload = {
					target: userID,
					caller: socket.id,
					sdp: peer.localDescription
				};
				socket.emit('offer', payload);
			})
			.catch((e) => console.log(e));
	}

	function handleRecieveCall() {
		console.log('incomming offer', incommingPayload);
		peer = createPeer(remoteUser);
		const desc = new RTCSessionDescription(incommingPayload.sdp);

		peer
			.setRemoteDescription(desc)
			.then(() => {
				userStream.getTracks().forEach((track) => peer.addTrack(track, userStream));
			})
			.then(() => {
				return peer.createAnswer();
			})
			.then((answer) => {
				console.log(answer);
				return peer.setLocalDescription(answer);
			})
			.then(() => {
				const payload = {
					target: incommingPayload.caller,
					caller: socket.id,
					sdp: peer.localDescription
				};
				socket.emit('answer', payload);
				isIncommingCall = true;
				incommingPayload = null;
				isCallAccepted = true;
			});
	}

	function handleAnswer(message: any) {
		console.log('incomming answer', message);
		remoteUser = message.caller;
		const desc = new RTCSessionDescription(message.sdp);
		peer.setRemoteDescription(desc).catch((e) => console.log(e));
		isCallAccepted = true;
	}

	function handleICECandidateEvent(e: RTCPeerConnectionIceEvent) {
		if (e.candidate) {
			console.log('ice', e.candidate);
			const payload = {
				target: remoteUser,
				candidate: e.candidate
			};
			socket.emit('ice-candidate', payload);
		}
	}
	function handleNewICECandidateMsg(incoming: any) {
		console.log('incomming ice', incoming);
		const candidate = new RTCIceCandidate(incoming);

		peer.addIceCandidate(candidate).catch((e) => console.log(e));
	}

	function handleTrackEvent(e: RTCTrackEvent) {
		console.log('remote track', e.streams);
		remoteStream = e.streams[0];
	}

	function handleHangUp() {
		socket.emit('end-call', {
			from: socket.id,
			to: remoteUser
		});
		stopMediaTracks();
		isCallAccepted = false;
		remoteUser = '';
		goto('/');
	}

	function handleRemoteCallEnd(data: any) {
		stopMediaTracks();
		console.log(userStream.active);
		console.log(remoteStream.active);
		isCallAccepted = true;
		remoteUser = '';
		goto('/');
	}
	function stopMediaTracks() {
		if (remoteStream?.active) {
			const tracks = remoteStream.getTracks();
			for (const track of tracks) {
				track.stop();
			}
		}

		if (userStream?.active) {
			const tracks = userStream.getTracks();
			for (const track of tracks) {
				track.stop();
			}
		}
	}

	function toggleCamera() {
		const tracks = userStream.getVideoTracks();
		tracks[0].enabled = !tracks[0].enabled;
		isUserCameraOn = tracks[0].enabled;
	}

	function toggleMic() {
		const tracks = userStream.getAudioTracks();
		tracks[0].enabled = !tracks[0].enabled;
		isUserMicOn = tracks[0].enabled;
	}


//     async function captureScreen() {
//     let mediaStream = null;
//     try {
//         mediaStream = await navigator.mediaDevices.getDisplayMedia({
//             video: {
//                 cursor: "always"
//             },
//             audio: false
//         });

//         // document.getElementById("local-video").srcObject = mediaStream;
//     } catch (ex) {
//         console.log("Error occurred", ex);
//     }
// }

 function captureScreen() {
    let mediaStream = null;
		let localStream;
		navigator.mediaDevices
      .getDisplayMedia({ video: true }) // Request access to screen sharing
      .then(stream => {
        localStream = stream;
      })
      .catch(error => {
        console.error('Error accessing screen sharing:', error);
      });  
}

</script>


<svelte:head
	><title>
		Room | {data.roomId}
	</title></svelte:head
>
<div class="my-4 text-center">
	<h5 class="font-bold text-sm md:text-xl">Room: {data.roomId}</h5>
	<!-- incomming call  -->

	{#if isIncommingCall}
		<div class="flex items-center justify-center space-x-2 my-2">
			<span> Icomming call from <span class="font-semibold">{incommingPayload.caller}</span></span>
			<button
				class="w-9 h-9 grid place-items-center rounded-full bg-green-900 flex-none"
				on:click={handleRecieveCall}
				title="Receive"
			>
				<PhoneIcommingIcon />
			</button>
		</div>
	{/if}
</div>

<div class="h-full w-full">
	<Video isCurrentUser={true} user={currentUser} stream={userStream} />
	<Video {toggleCamera} user={remoteUser} stream={remoteStream} {isUserCameraOn} />
</div>

<!-- users in room  -->

<ul class="flex items-center gap-2 my-2 overflow-x-auto">
	{#each connectedUsers as user (user)}
		<li>
			<User on:callUser={(ev) => callUser(ev.detail.user)} {user} />
		</li>
	{/each}
</ul>
<!-- <button>Accept</button> -->
<div class="w-9/12">
<div class="flex items-center justify-center space-x-5 bottom-0 left-0 right-0 p-4">
	<button
		class="w-10 h-10 rounded-full grid place-items-center bg-red-900"
		on:click={handleHangUp}
		title="Hangup"
	>
		<PhoneIcon />
	</button>

	<button
		class={`w-10 h-10 rounded-full grid place-items-center ${
			isUserCameraOn ? 'bg-gray-700' : 'bg-red-900'
		}`}
		title="Toggle camera"
		on:click={toggleCamera}
	>
		{#if isUserCameraOn}
			<VideoOnIcon />
		{:else}
			<VideoOffIcon />
		{/if}
	</button>
	<button
		class={`w-10 h-10 rounded-full grid place-items-center ${
			isUserMicOn ? 'bg-gray-700' : 'bg-red-900'
		}`}
		title="Toggle mic"
		on:click={toggleMic}
	>
		{#if isUserMicOn}
			<MicIcon />
		{:else}
			<MicOffIcon />
		{/if}
	</button>

	<button on:click={captureScreen}>
     <SharescreenOn />
	</button>
	
</div>
</div>