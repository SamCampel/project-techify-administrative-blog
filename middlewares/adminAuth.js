function adminAuth(req, res, next){
   if(req.session.user == undefined){
       res.redirect("/login");
       return;
   }

   if(req.session.user.isAdmin !== true){
       res.status(403).send("Acesso negado");
       return;
   }

   next();
}

module.exports = adminAuth