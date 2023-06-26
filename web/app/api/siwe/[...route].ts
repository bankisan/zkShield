import { configureServerSideSIWE } from "connectkit-next-siwe";

const siweServer = configureServerSideSIWE({
  session: {
    cookieName: "zkshield-siwe",
    password: process.env.SESSION_SECRET,
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  },
});


export default siweServer.apiRouteHandler;
