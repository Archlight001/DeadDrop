var users = [];

//Add User to the chat
function addUser(id, session, socket,codename) {
  
  const duplicateUser = users.find((user) => user.id === id);

  if(duplicateUser === undefined){
    const user = { id, session, socket,codename };
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
  let user = users.find(user => user.socket === socket)
  users = users.filter((user) => user.socket !== socket);
  return user;
}

module.exports = { addUser, getAllUsers, removeUser };
