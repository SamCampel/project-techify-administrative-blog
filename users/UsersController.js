const express = require("express");
const router = express.Router();
const User = require("./User");
const bcrypt = require('bcryptjs');
const Category = require("../categories/Category")

router.get("/admin/users", (req, res) => {
    User.findAll().then(users => {
        Category.findAll().then(categories => {
            res.render("admin/users/index", { users: users, categories: categories });
        });
    });
});

router.get("/admin/users/create", (req, res) => {
    Category.findAll().then(categories => {
        res.render("admin/users/create", { categories: categories });
    });
});

router.post("/users/create", (req, res) => {
    var nome = req.body.nome;
    var email = req.body.email;
    var password = req.body.password;
    
    User.findOne({where:{email: email}}).then( user => {
        if(user == undefined){

            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password, salt);
            
            User.create({
                nome: nome,
                email: email,
                password: hash
            }).then(() => {
                res.redirect("/");
            }).catch((err) => {
                res.redirect("/");
            });


        }else{
            res.redirect("/admin/users/create");
        }
    });
});

router.post("/users/delete", (req, res) => {
    var id = req.body.id;
    if(id != undefined){
        if(!isNaN(id)){
            User.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect("/admin/users");
            });
        }else{// NÃO FOR UM NÚMERO
            res.redirect("/admin/users");
        }
    }else{ // NULL
        res.redirect("/admin/users");
    }
});

router.get("/login", (req, res) => {
    Category.findAll().then(categories => {
        res.render("admin/users/login", { categories: categories });
    });
});

router.post("/authenticate", (req, res) => {

    var email = req.body.email;
    var password = req.body.password;

    User.findOne({where:{email: email}}).then(user => {
        if(user != undefined){ // Se existe um usuário com esse e-mail
            // Validar senha, aceitando hashes bcrypt e senhas legadas em texto puro
            var correct = false;

            if (typeof user.password === 'string') {
                correct = user.password === password || bcrypt.compareSync(password, user.password);
            }

            if(correct){
                req.session.user = {
                    id: user.id,
                    email: user.email
                }
                res.redirect("/admin/articles");
            }else{
                res.redirect("/login"); 
            }

        }else{
            res.redirect("/login");
        }
    });

});

router.get("/logout", (req, res) => {
    req.session.user = undefined;
    res.redirect("/");
})


module.exports = router;