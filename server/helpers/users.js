const users = [];

//Add User to the chat
function addUser(id, session) {
  const user = { id, session };
  users.push(user);
  return user;
}


module.exports = {addUser};
