const {db} = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('dotenv').config(); 

module.exports.loginUser = (req, res) => {
    
    try{
        const q = 'SELECT * FROM participants WHERE email = ?';

        db.query(q, [req.body.email], (err, data) => {
            if (err) return res.status(500).json({message : err.message});

            if (data.length == 0) {            
                return res.status(400).json({message : 'Invalid email address'});
            }
            
            const user = data[0];
            const isPasswordValid = bcrypt.compareSync(req.body.password, user.password);
            
            if (!isPasswordValid) {
                // Return an error for invalid password
                return res.status(400).json({message : 'Incorrect Password,Try again'});
            }

            const { password, ...other } = user;            

            const token = jwt.sign(
                { id: user.email }, 
                process.env.JWT_SECRET, 
                { expiresIn: '3h' }
            );
            
            const expirationDate = new Date(Date.now() + 4 * 60 * 60 * 1000); // 4 hours from now

            res.status(200)
              .cookie("access_token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                path: "/",
                maxAge: 4 * 60 * 60 * 1000,  // 4 hours in milliseconds
                expires: expirationDate      // Explicit expiration date
              })
              .json({ ...other });
            
          
        });
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
};
0
module.exports.logoutUser = (req, res) => {
    try {
        res.status(200)
        .cookie("access_token", "", {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          path: "/",          // Ensure this matches the login cookie's path
          expires: new Date(0) // Expire the cookie immediately
        })
        .json({ message: "Logged out successfully" });      
    } catch (err) {
      return res.status(500).send({ message: err.message });
    }
  };
  
module.exports.registerUser = (req,res) => {

    try{
        const {email,password,username} = req.body; 
        
        const q = 'SELECT * FROM participants WHERE email = ?';   
        db.query(q, [email], (err, data) => {
            if (err) return res.status(500).json({message : err.message});
            if (data.length) return res.status(409).json({message : "A participant with this email already exists"});
            
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);
            
            const qInsert = "INSERT INTO participants (teamName,email,password) VALUES (?,?,?)";
            const values = [username,email, hash];
            
            db.query(qInsert, values, (err, data) => {
                if (err){ 
                    console.log('error inserting',err.message);
                    return res.status(500).json({message : err.message});}
                return res.status(200).json({message : 'Participant registered successfully'});
            });
        });
    
    }catch(err){
        return res.status(500).json({message : err.message})
    }
}


module.exports.retrieveCookie = (req, res) => {
    const token = req.cookies.access_token;
    try{
        if (!token) {
            return res.status(200).json({ restore : false,message: 'No session found to recover' });
    }
    
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err || !decoded.id) {
            return res.status(200).json({ restore: false, message: 'Token expired or invalid' });
        }
        
        const account_query = 'SELECT * FROM participants WHERE email = ?';
        
        db.query(account_query, [decoded.id], (err, result) => {
            if (err || result.length === 0) {
                console.log('error here', err);
                return res.status(400).json({ restore: false, message: 'Error retrieving user data' });
            }
            const { password, ...other } = result[0];
            return res.status(200).json({ restore: true, userData: other });
        });
    });
    
    }
    catch(err){
        console.log(err.message);
    }
};


module.exports.getDashboard = (req, res) => {
    try {
        const team_id = req.params.id;
        const q = `
            SELECT s.id as id, q.title as queryTitle, q.difficulty as difficulty, 
                   s.status as status, s.submitted_at as submittedAt
            FROM queries q 
            JOIN solutions s ON q.queryId = s.queryId
            WHERE team_id = ?
        `;

        db.query(q, [team_id], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(400).json([]);
            }
            res.status(200).json(result);
        });
    } catch (err) {
        console.log(err);
        res.status(500).json([]);
    }
};

module.exports.deleteParticipants = (req,res) => {
   try{
    const q = `delete from participants where team_id != 1`;
    db.execute(q);
    res.status(200).json({message : 'participants deleted'})
}catch(err){
    console.log(err.message);
}
};

module.exports.fetchLevel = (req,res) => {
const team_id = req.params.id;
    try{
        const q = `select level from participants where team_id = ?`;
        db.query(q, [team_id], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(400).json([]);
            }
            res.status(200).json(result);
        });
    } catch (err) {
        console.log(err);
        res.status(500).json([]);
    }
}
module.exports.markTutorialDone = (req,res) => {
    try{
        const q = `update participants set firstLogin = false where team_id = ${req.body.team_id}`;
        db.execute(q);
        res.status(200).json({message : 'User marked'})
    }catch(err){
        console.log(err.message);
    }
};
