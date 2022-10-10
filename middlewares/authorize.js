const jwt_decode = require('jwt-decode');
const { ClientError } = require('../errors');

const authorize = (roles) => {
  return (req, res, next) => {
    const token = req.headers.authorization;
    const decoded = jwt_decode(token);
    if(token){
      try{      
        if(decoded.is_admin  || decoded.id === req.body.id || roles === 'personal'){
          next()
        }else{
          throw new ClientError("You must be admin to take this action", 404)
        }
      }catch(err){
        throw err
      }
    } else {
      throw new ClientError("You are not authenticated", 404)
    }
  }

}
module.exports = authorize