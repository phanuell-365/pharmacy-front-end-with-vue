export interface Submenu {
  // a brief text to describe the submenu
  desc: string;
  // the submenu's name
  name: string;
  // the link to the page to go to
  href: string;
  // the name of the router
  routeName: string;
  // the submenu's icon
  ico: string;
  // tells whether the submenu is active or not
  active: boolean;
}
