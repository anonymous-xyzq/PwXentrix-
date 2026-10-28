const GOOGLE_CLIENT_ID = "545834337515-jiocqqem62oos4as4c4cvchm0u2u4ugp.apps.googleusercontent.com";

export async function onRequestPost({ request }) {
  try {
    const { credential } = await request.json();

    if (!credential) {
      return Response.json(
        { error: "Google credential missing" },
        { status: 400 }
      );
    }

    const response = await fetch(
      "https://oauth2.googleapis.com/tokeninfo?id_token=" +
        encodeURIComponent(credential)
    );

    if (!response.ok) {
      return Response.json(
        { error: "Invalid Google login" },
        { status: 401 }
      );
    }

    const data = await response.json();

    if (
      data.aud !== GOOGLE_CLIENT_ID ||
      data.iss !== "https://accounts.google.com" ||
      Number(data.exp) * 1000 <= Date.now()
    ) {
      return Response.json(
        { error: "Google verification failed" },
        { status: 401 }
      );
    }

    return Response.json({
      authenticated: true,
      name: data.name || "",
      email: data.email || ""
    });
  } catch {
    return Response.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
