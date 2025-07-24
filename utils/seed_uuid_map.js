const { v4: uuidv4 } = require('uuid');
const {uuidToBin} = require('../custom_functions/format_uuid.js');

module.exports = {
  roles: {
    super_admin: uuidv4(),
    user_admin: uuidv4(),
    customer: uuidv4(),
    serviceman: uuidv4(),
    editor: uuidv4(),
    viewer: uuidv4(),
  },
  permissions: {
    view_users: uuidv4(),
    edit_users: uuidv4(),
    delete_users: uuidv4(),
    access_reports: uuidv4(),
  },
  uuidToBin,
};
