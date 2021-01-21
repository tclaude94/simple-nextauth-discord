import temp from "../../../database/temp.json";
import { getSession } from "next-auth/client";

export default async (req, res) => {
  const session = await getSession({ req });
  if (session) console.log("Session", JSON.stringify(session, null, 2)); // Pour voir la struct des infos recues
  const requestedServer = temp[req.query.id] || []; // Récupère les infos d'un serveur

  // Dég mais gère 2 fonctionnement diff rapidement
  if (["288659194737983489", "2"].includes(req.query.id)) {
    if (!session) return res.status(401).end();

    /*
       La requete vient elle d'un admin ? Ici j'utilise un tableau avec les id d'admin dedans mais on peut imaginer un appel à l'API Discord 
       (via discordjs / erisjs (https://github.com/abalabahaha/eris) )
    */
    if (!requestedServer.admins.includes(session.user.id))
      return res.status(403).end();

    res.status(200).json({ queryId: req.query.id, requestedServer });
  } else {
    res
      .status(200)
      .json({ isLogged: !!session, queryId: req.query.id, requestedServer });
  }
};

/*

pour gérer les différentes méthodes HTTP :

export default (req, res) => {
  switch (req.method) {
    case 'GET':
      break
    case 'POST':
      break
    default:
      res.status(405).end()
      break
  }
}
*/
