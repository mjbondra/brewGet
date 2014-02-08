
/**
 * Navigation
 * GET /api/nav
 */
module.exports = function* () {
  var nav = {};
  nav.content = [
    { title: 'Posts', href: '/' },
    { title: 'Users', href: '/users'},
    { title: 'Beers', href: '/beers' },
    { title: 'Breweries', href: '/breweries' }
  ];
  if (this.user) {
    nav.actions = [
      { title: 'Message', href: '/messages/new' },
      { title: 'Post', href: '/posts/new' }
    ];
    nav.account = [
      { title: 'Activity', href: '/account/dashboard' },
      { title: 'Inbox', href: '/account/inbox' },
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
}
