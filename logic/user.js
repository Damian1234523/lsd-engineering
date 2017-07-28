// Alle Abhängigkeiten einbinden
var fs = require("fs");
var jwt = require('jsonwebtoken');
var userconfig = require('../user.json');

exports.login = function(req, res) {
    if(userconfig.username == req.body.username)
    {
        var user = userconfig;
        if (!user)
        {
			res.status(401).json({ success: false, message: 'User not found.' });
        }
        else if (user)
        {
            if (user.password != req.body.password) 
            {
				res.status(401).json({ success: false, message: 'Wrong password.' });
            } 
            else 
            {
                var token = jwt.sign(user, 'Mad Monday', { expiresIn: 86400 }); // expires in 1 day 
                res.status(200).json({ success: true, message: 'Token has been created!', token: token});
			}		
		}
    } 
    else 
    {
        res.status(401).json({ success: false, message: 'User not found' });
    }
}

exports.passwordRecovery = function(req, res, istokenvalid) {
    if(istokenvalid)
    {
        if(userconfig.password == req.body.oldpassword) 
        {
            var user = userconfig;
            userconfig.password = req.body.newpassword;
            fs.writeFile('./user.json', JSON.stringify(userconfig), 'utf-8', (err) => {
                if (err) 
                {
                    res.status(401).json({error: err});
                } 
                else 
                {   
                    var token = jwt.sign(user, 'Mad Moday', { expiresIn: 86400 }); // expires in 1 day 
                    res.status(200).json({ token: token});
                    delete require.cache["./user.json"];
                }
            });
        } 
        else 
        {
            res.status(401).json({ message: 'password old and invalid'});
        }
    } 
    else 
    {
        res.status(401).json({ message: 'invalid token'});
    }
    
}