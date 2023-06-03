// import type { LoginModel, UserRole } from '$lib/types/domain.models';
// import { CookieUtils } from '$lib/utils/cookie.utils';
// import { SessionManager } from './api/auth/session';
// import { getCareplanCategories, getUserRoles, getUserRoleById } from './api/services/types';
import type { PageServerLoad, Action } from './$types';
import { error, type RequestEvent } from '@sveltejs/kit';


////////////////////////////////////////////////////////////////

export const actions = {
  login: async (event: RequestEvent) => {
    const request = event.request;
    const data = await request.formData(); // or .json(), or .text(), etc
    console.log(Object.fromEntries(data));
    const firstname = data.has('firstname') ? data.get('firstname') as string : null;
    const lastname = data.has('lastname') ? data.get('lastname') as string : null;
    const email = data.has('email') ? data.get('email') as string : null;
    const password = data.has('password') ? data.get('password') as string: null;

    if (!email || !password) {
      throw error(400, `Username or password are not valid!`);
    }
    console.log(`data....... = ${JSON.stringify(request, null, 2)}`);
    const response = await login(email, password);
    console.log('response', response);

    if (response.Status === 'failure' || response.HttpCode !== 200) {
      console.log(response.Message);
     
      throw redirect(303, '/', event);
    }

    const user = response.Data.User;
    const accessToken = response.Data.AccessToken;
    const expiryDate = new Date(response.Data.SessionValidTill);
    const sessionId = user.SessionId;
    const userRoles = await getUserRoles();
    const currentUserRoleName = getUserRoleById(userRoles, user.CurrentRoleId);
    console.log('currentUserRoleName =', currentUserRoleName);
    const userId = user.UserId;
    if (currentUserRoleName === 'Moderator') {
      const session = await SessionManager.constructSession(user, accessToken, expiryDate);

      if (!session) {
        console.log(`Session cannot be constructed!`);
        throw redirect(
          303,
          `/`,
          errorMessage(`User login session cannot be created!`),
          event
        );
      }
      console.log('Session - ' + JSON.stringify(session, null, 2));
      const userSession = await SessionManager.addSession(session.sessionId, session);
      console.log(JSON.stringify(userSession, null, 2));

      CookieUtils.setCookieHeader(event, 'sessionId', sessionId);
      throw redirect(
        303,
        `/users/${userId}/home/moderators`,
        successMessage(`Moderator login sussessfully!`),
        event
      );
    } else if (currentUserRoleName === 'Admin') {
      const session = await SessionManager.constructSession(user, accessToken, expiryDate);
      if (!session) {
        console.log(`Session cannot be constructed!`);
        throw redirect(
          303,
          `/`,
          errorMessage(`User login session cannot be created!`),
          event
        );
      }
      console.log('Session - ' + JSON.stringify(session, null, 2));
      const userSession = await SessionManager.addSession(session.sessionId, session);
      console.log(JSON.stringify(userSession, null, 2));

      CookieUtils.setCookieHeader(event, 'sessionId', sessionId);
      throw redirect(303, `/users/${userId}/home/admins`, successMessage(`Admin login successful!`), event);
    } else {
      throw redirect(303, `/`, errorMessage(`Unsupported user role!`), event);
    }
  }
};
