
/**
 * Navigation
 * GET /api/nav
 */
module.exports = function* () {
  var nav = {};
  if (typeof this.session.user === 'object') {
    nav.actions = [
      { title: 'Chat', href: '/chat' },
      { title: 'Post', href: '/posts/new' }
    ];
    nav.account = [
      { title: 'Activity', href: '/account/activity' },
      { title: 'Inbox', href: '/account/inbox' },
      { title: 'Message', href: '/messages/new' },
      { title: 'Settings', href: '/account/settings' },
      { title: 'Sign out', href: '/account/sign-out' }
    ];
  } else {
    nav.actions = [
      { title: 'Sign up', href: '/account/sign-up' },
      { title: 'Sign in', href: '/account/sign-in' }
    ];
  }
  this.body = nav;
};
