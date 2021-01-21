import Head from "next/head";
import styles from "../styles/Home.module.css";
import { signIn, signOut, useSession, getSession } from "next-auth/client";

import useSWR from "swr";

const fetcher = (url, accessToken) =>
  fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then(async (res) => {
    if (res.status !== 200) throw new Error("Problème API");
    const guilds = res.json();
    return guilds;
  });

export default function Home() {
  const [session, loading] = useSession();
  const { data: guilds, error } = useSWR(
    !loading && session
      ? ["https://discord.com/api/users/@me/guilds", session.user.accessToken]
      : null,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>

        {!session && (
          <>
            <p>Salut t'es pas log</p>
            <button onClick={() => signIn("discord")}>Login discord</button>
          </>
        )}

        {session && (
          <>
            <p>Salut t'es log</p>
            <button onClick={() => signOut()}>Logout</button>
          </>
        )}
        <div
          style={{ margin: "75px", display: "flex", flexDirection: "column" }}
        >
          <a
            href="/api/server/1"
            target="_blank"
            style={{ marginBottom: "5px" }}
          >
            Lien random sans infos dans la db temp dispo pour tous
          </a>
          <a
            href="/api/server/1234"
            target="_blank"
            style={{ marginBottom: "5px" }}
          >
            Lien dispo pour tous
          </a>
          <a
            href="/api/server/288659194737983489"
            target="_blank"
            style={{ marginBottom: "5px" }}
          >
            Lien uniquement pour toi (si pas connecté err 401)
          </a>
          <a
            href="/api/server/2"
            target="_blank"
            style={{ marginBottom: "5px" }}
          >
            Lien pas dispo pour toi -&gt; 403 (si pas connecté err 401)
          </a>
        </div>

        {!guilds && !error && session && <p>Chargement ...</p>}
        {error && <p>{error.message} retry en cours ...</p>}
        {guilds && (
          <div>
            {guilds.map((guild, id) => (
              <div style={{ display: "inline-flex" }} key={id}>
                <img
                  width="60px"
                  height="60px"
                  src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp`}
                  style={{ borderRadius: "50%" }}
                />
                <p>
                  {guild.name} {guild.owner ? "(owner)" : ""}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
