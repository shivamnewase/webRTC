<script lang="ts">
	import CreateRoom from '../../lib/components/CreateRoom.svelte';
	import JoinRoom from '../../lib/components/JoinRoom.svelte';
	// import Navbar from "../../lib/components/Navbar.svelte";

	import './style.css';
  import { goto } from "$app/navigation";

  let roomId: string;
  function handleJoin() {
    goto(roomId);
  }

  import Time, { svelteTime } from "svelte-time";
	import { dayjs } from "svelte-time";
	
	let time = dayjs().format('MMM DD, YYYY')
</script>

<svelte:head>
	<title>Home | Video Call</title>
</svelte:head>
<div class="min-h-screen dark:bg-gray-900 dark:text-gray-200">
	<!-- <Navbar /> -->
	<main>
		<!-- <section class="bg-white dark:bg-gray-900">
			<div
				class="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12"
			>
				<div class="mr-auto place-self-center lg:col-span-7">
					<h1
						class="max-w-3xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white"
					>
						Open source one to one video call.
					</h1>
					<p
						class="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400"
					>
						An open source video calling web app build with sveltekit, socketio and tailwindcss
					</p>

					<div class="flex items-center gap-4 flex-col sm:flex-row">
						<CreateRoom />
						<JoinRoom />
					</div>
				</div>
				<div class="hidden lg:mt-0 lg:col-span-5 lg:flex">
					<img src="hero.svg" alt="mockup" />
				</div>
			</div>
		</section> -->

		<!-- NAVBAR -->
		<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
		<link
			rel="stylesheet"
			href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.14.0/css/all.min.css"
		/>
		<!-- <JoinRoom /> -->
		<!-- NAVBAR TOP -->
		<div class="grid-padre-navbar-top">
			<div class="center-navbar-top">
				<div class="grid-navegacion-top-icons">
					<div class="mr-icons">
						<div class="img-center">
							<span class="material-icons md-blue"> home </span>
						</div>
						<p class="title-navegacion-active">Home</p>
					</div>
					<div class="mr-icons">
						<div class="img-center">
							<span class="material-icons md-gray"> chat_bubble </span>
						</div>
						<p class="title-navegacion">Chat</p>
					</div>
					<div class="mr-icons">
						<div class="img-center">
							<span class="material-icons md-gray"> access_time </span>
						</div>
						<p class="title-navegacion">Meetings</p>
					</div>
					<div class="mr-icons">
						<div class="img-center">
							<span class="material-icons md-gray"> portrait </span>
						</div>
						<p class="title-navegacion">Contacts</p>
					</div>
				</div>
			</div>

			<div class="end-bar-navegacion-top" style="margin-top: 0px;">
				<br />
				<div class="input-group-login sombreado-input">
					<div class="input-group-prepend-login">
						<span class="input-group-text fondo-icon">
							<span class="material-icons"> search </span>
						</span>
					</div>
					<input
						type="text"
						class="border-0-login form-control-login input-border-none"
						placeholder="Search"
						aria-label="Username"
					/>
				</div>

				<div class="box-user" style="margin-bottom: 5px;">
					<p style="margin-top: 5px;">N</p>
				</div>
			</div>
		</div>

		<!-- BOX CENTER -->
		<div class="box-zoom">
			<div class="grid-zoom">
       
				<div class="grid-icons" style="margin-top: 190px;">
					<button class="box-video" style="background-color: #FF742E;">
						<div class="img-center">
							<span class="material-icons md-55"> videocam </span>
						</div>
						<p class="flex pt-6 justify-center icon-title"> <CreateRoom /></p>
					</button>

					<div class="box-video" style="background-color: #0E71EB;">
            <label for="my-modal" >
            <div class="img-center">
							<span class="material-icons md-55"> add_box </span>
						</div>
						<br /><br />
						
              <!-- <JoinRoom /> -->
            
           </label>

            <!-- Put this part before </body> tag -->
            <input type="checkbox" id="my-modal" class="modal-toggle" />
            <div class="modal">
              <div class="modal-box">
                
                
                    <h2 class="text-2xl font-bold mb-4 text-center">Join Meeting</h2>
                    <form>
                      <div class="mb-4">
                        <!-- <label for="email" class="block text-gray-700 text-sm font-bold mb-2">Email</label> -->
                        <input 
                        name="roomId"
                          bind:value={roomId} class="w-full px-3 py-2 rounded border-blue-300 focus:outline-none focus:ring focus:border-blue-300" placeholder="Meeting ID or Personal Link Name" required>
                      </div>
                      <div class="mb-6">
                        <!-- <label for="password" class="block text-gray-700 text-sm font-bold mb-2">Password</label> -->
                        <!-- <input type="password" id="password" name="password" class="w-full px-3 py-2 rounded border-blue-300 focus:outline-none focus:ring focus:border-blue-300" placeholder="Enter your name" required> -->
                      </div>
                      <div class="flex items-center justify-end gap-4">
                        <button type="submit" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" on:click={handleJoin} title="Join room"><JoinRoom /></button>
                        <label for="my-modal" class="bg-transparent text-black hover:bg-[#eeeef8] border border-[#eeeef8] font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Cancel</label> 
                     
                      </div>
                    </form>
                  </div>
                
									
            </div>
					</div>

					<div class="box-video" style="background-color: #0E71EB; margin-top: 50px;">
						<div class="img-center">
							<i class="fas fa-calendar material-icons md-55" />
						</div>
						<br /><br />
						<p class="flex justify-center icon-title">Schedule</p>
					</div>

					<div class="box-video" style="background-color: #0E71EB; margin-top: 50px;">
						<div class="img-center">
							<span class="material-icons md-55"> screen_share </span>
						</div>
						<br /><br />
						<p class="flex justify-center icon-title">Share Screen</p>
					</div>
				</div>
				<div class="card-time" style="margin-top: 100px;">
					<div class="box-time">
						<br /><br />
						<p />
						<p class="title-clock flex flex-col">
             
              <Time format="h:mm a" />
              
              <span class="title-date">
                <Time format="dddd" />,
                <time use:svelteTime />
              </span>
						</p>
						<br />
					</div>
					<div class="box-time-white">
						<br /><br /><br /><br /><br /><br />
						<p class="flex justify-center">
							<span> No upcoming meetings today </span>
						</p>
					</div>
				</div>
			</div>

			<!-- NAVBAR FOOTER -->

			<div class="navbar-zoom fixed-bottom grid-navigation">
				<div>
					<div class="img-center">
						<span class="material-icons md-blue"> home </span>
					</div>
					<p class="title-navegacion-active">Home</p>
				</div>
				<div>
					<div class="img-center">
						<span class="material-icons md-gray"> chat_bubble </span>
					</div>
					<p class="title-navegacion">Chat</p>
				</div>
				<div>
					<div class="img-center">
						<span class="material-icons md-gray"> access_time </span>
					</div>
					<p class="title-navegacion">Meetings</p>
				</div>
				<div>
					<div class="img-center">
						<span class="material-icons md-gray"> portrait </span>
					</div>
					<p class="title-navegacion">Contacts</p>
				</div>
			</div>
		</div>
	</main>
</div>
