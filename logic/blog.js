var fs = require('fs');
var ObjectID = require('mongodb').ObjectID;
var blog = require('../blog.json');

exports.showall = function(req, res, istokenvalid) {
    if(istokenvalid)
    {
        res.status(200).json(blog);
    }
    else
    {
        //only hidden = false
        res.status(200).json(blog.filter(function(item){return (item.hidden == false);}));
    }
}

exports.showone = function(req, res, istokenvalid) {
    if (blog[req.params.id].hidden) 
    {
        if(istokenvalid)
        {
            res.status(200).json(blog[req.params.id]);
        } 
        else 
        {
            res.status(401).json({message : 'Item is hidden'});
        }
    } 
    else
    {
        res.status(200).json(blog[req.params.id]);
    }
}

exports.deletepost = function(req, res, istokenvalid) {
    if (blog[req.params.id].hidden)
    {
        if(istokenvalid)
        {
            // delete item
            blog.splice(req.params.id ,1);
            // write to file
            fs.writeFile('./blog.json', JSON.stringify(blog), 'utf-8', (err) => {
                if (err) 
                {
                    res.status(401).json({error: err});
                } 
                else 
                {   
                    res.status(200).json({ message: 'deleted'});
                    delete require.cache["./blog.json"];
                }
            });
        } 
        else 
        {
           // hidden, jwt not valid
            res.status(401).json({ message: 'no valid jwt'});
        }
    } 
    else
    {
        blog.splice(req.params.id ,1);
        fs.writeFile('./blog.json', JSON.stringify(blog), 'utf-8', (err) => {
            if (err) 
            {
                res.status(401).json({error: err});
            } 
            else 
            {   
                res.status(200).json({ message: 'deleted'});
                delete require.cache["./blog.json"];
            }
        });
    }
}

exports.updatepost = function(req, res, istokenvalid) {
    if(blog[req.params.id].hidden)
    {
        if(istokenvalid) 
        {
            blog[req.params.id].title   = req.body.title    || blog[req.params.id].title;
            blog[req.params.id].picture = req.body.picture  || blog[req.params.id].picture;
            blog[req.params.id].author  = req.body.author   || blog[req.params.id].author;
            blog[req.params.id].about   = req.body.about    || blog[req.params.id].about;
            blog[req.params.id].released= req.body.released || blog[req.params.id].released;
            blog[req.params.id].hidden  = req.body.hidden   || blog[req.params.id].hidden;
            blog[req.params.id].tags = req.body.tags || blog[req.params.id].tags;
            //write to file
            fs.writeFile('./blog.json', JSON.stringify(blog), 'utf-8', (err) => {
                if (err)
                {
                    res.status(401).json({error: err});
                } 
                else 
                {   
                    res.status(200).json(blog[req.params.id]);
                    delete require.cache["./blog.json"];
                }
            });
        } 
        else 
        {
            res.status(401).json({ message: 'no valid jwt'});
        }
    } 
    else 
    {
        blog[req.params.id].title   = req.body.title    || blog[req.params.id].title;
        blog[req.params.id].picture = req.body.picture  || blog[req.params.id].picture;
        blog[req.params.id].author  = req.body.author   || blog[req.params.id].author;
        blog[req.params.id].about   = req.body.about    || blog[req.params.id].about;
        blog[req.params.id].released= req.body.released || blog[req.params.id].released;
        blog[req.params.id].hidden  = req.body.hidden   || blog[req.params.id].hidden;
        blog[req.params.id].tags = req.body.tags || blog[req.params.id].tags;
        //write to file
        fs.writeFile('./blog.json', JSON.stringify(blog), 'utf-8', (err) => {
            if (err) 
            {
                res.status(401).json({error: err});
            } 
            else 
            {   
                res.status(200).json(blog[req.params.id]);
                delete require.cache["./blog.json"];
            }
        });
    }   
}

exports.createpost = function(req, res, istokenvalid) {
    if(istokenvalid) {
        // check attributes
        if (!req.body.title || !req.body.picture || !req.body.author || !req.body.about || !req.body.released || !req.body.hidden || !req.body.tags)
        {
            res.status(401).json({message: 'please fill all parameters'});
        }
        else
        {
            // create entry
            var newindex = 0;
            while (typeof blog[newindex] !== 'undefined') 
            {
                newindex++;
            }
            var newentry =
            {
                _id : new ObjectID(),
                index : newindex,
                title : req.body.title,
                picture : req.body.picture,
                author : req.body.author,
                about : req.body.about,
                released : req.body.released,
                hidden : req.body.hidden,
                tags : req.body.tags
            };
            // add to blog
            blog.push(newentry);
            // write to file
            fs.writeFile('./blog.json', JSON.stringify(blog), 'utf-8', (err) => {
                if (err)
                {
                    res.status(401).json({error: err});
                }
                else 
                {   
                    res.status(200).json({ id: newindex});
                    delete require.cache["./blog.json"];
                }
            });
        }
    } 
    else 
    {
        //not valid
        res.status(401).json({ message: 'no valid jwt'});
    }
}