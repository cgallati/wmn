const redirects = async () => {
  const internetExplorerRedirect = {
    destination: '/ie-incompatible.html',
    has: [
      {
        type: 'header',
        key: 'user-agent',
        value: '(.*Trident.*)', // all ie browsers
      },
    ],
    permanent: false,
    source: '/:path((?!ie-incompatible.html$).*)', // all pages except the incompatibility page
  }

  const bookRedirect = {
    source: '/book',
    destination: '/services',
    permanent: true,
  }

  const redirects = [internetExplorerRedirect, bookRedirect]

  return redirects
}

export default redirects
