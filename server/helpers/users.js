var users = [];

//Add User to the chat
function addUser(id, session, socket) {
  
  const duplicateUser = users.find((user) => user.id === id);

  if(duplicateUser === undefined){
    const user = { id, session, socket };
    users.push(user);
    return user;   
  }else{
    return {}
  }
  
}

function getAllUsers() {
  return users;
}

function removeUser(socket) {
  users = users.filter((user) => user.socket !== socket);
  return users;
}

module.exports = { addUser, getAllUsers, removeUser };
