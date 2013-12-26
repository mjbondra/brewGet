
/**
 * Items
 * GET /api/nav
 */
exports.items = function* () {
  var nav = {};
  nav.content = [
    {
      title: 'Posts',
      href: '/'
    },
    {
      title: 'Users',
      href: '/users'
    },
    {
      title: 'Beers',
      href: '/beers'
    },
    {
      title: 'Breweries',
      href: '/breweries'
    }
  ];
  if (this.session.user) {
    nav.actions = [
      {
        title: 'Trade',
        href: '/trade/new'
      },
      {
        title: 'Post',
        href: '/posts/new'
      }
    ];
    nav.account = [
      {
        title: 'Settings',
        href: '/account/settings'
      },
      {
        title: 'Sign out',
        href: '/account/sign-out'
      },
      {
        title: 'MyTrades',
        href: '/account/my-trades'
      },
      {
        title: 'MyPosts',
        href: '/account/my-posts'
      }
    ];
  } else {
    nav.actions = [
      {
        title: 'Sign up',
        href: '/account/sign-up'
      },
      {
        title: 'Sign in',
        href: '/account/sign-in'
      }
    ];
  }
  this.body = yield nav;
}
