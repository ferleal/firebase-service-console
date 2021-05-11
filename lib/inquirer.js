const inquirer = require('inquirer'); // TODO: Bug: Fix crash with wrong email address
// TODO: Bug: Add new users does not return to main
// TODO: Feat: Update Users should have option to return the update user with the same Id or return to main


const uid = {
  name: 'uid',
  type: 'input',
  message: 'Enter user Id:',
  validate: function (value) {
    if (value.length) {
      return true;
    } else {
      return 'Please enter user Id.';
    }
  }
};
const claim = {
  name: 'claim',
  type: 'list',
  message: 'What is the user Type:',
  choices: [{
    name: 'End User',
    value: false
  }, {
    name: 'Admin User',
    value: 'admin'
  }, {
    name: 'Define one',
    value: 'askCustomClaim'
  }]
};
const email = {
  name: 'email',
  type: 'input',
  message: 'Enter your e-mail address:',
  validate: function (value) {
    if (value.length) {
      return true;
    } else {
      return 'Please enter your e-mail address.';
    }
  }
};
const password = {
  name: 'password',
  type: 'password',
  message: 'Enter your password:',
  validate: function (value) {
    if (value.length) {
      return true;
    } else {
      return 'Please enter your password.';
    }
  }
};
const displayName = {
  name: 'displayName',
  type: 'input',
  message: 'Enter your Display Name:',
  validate: function (value) {
    if (value.length) {
      return true;
    } else {
      return 'Please enter your Display Name.';
    }
  }
};
const emailVerified = {
  name: 'emailVerified',
  type: 'confirm',
  message: 'Set email as verified?',
  validate: function (value) {
    if (value.length) {
      return true;
    } else {
      return 'Please enter your Display Name.';
    }
  }
};
module.exports = {
  askPath: () => {
    const questions = [{
      name: 'runNext',
      type: 'list',
      message: 'What can I do for you:',
      choices: [{
        name: 'Show Users',
        value: {
          extra: {
            action: 'show'
          },
          next: 'askShowUserOpt'
        }
      }, {
        name: 'Add Users From Csv',
        value: {
          extra: {
            action: 'addCsvFile'
          },
          next: 'askAddUserFileCsvOpt'
        }
      }, {
        name: 'Add Users From Json',
        value: {
          extra: {
            action: 'addFile'
          },
          next: 'askAddUserFileOpt'
        }
      }, {
        name: 'Add Users',
        value: {
          extra: {
            action: 'add'
          },
          next: 'askAddUserOpt'
        }
      }, {
        name: 'Update Users',
        value: {
          extra: {
            action: 'update'
          },
          next: 'askUpdateUserOpt'
        }
      }, {
        name: 'Remove Users',
        value: {
          extra: {
            action: 'remove'
          },
          next: 'askRemoveUserOpt'
        }
      }, {
        name: 'Delete All Users',
        value: {
          extra: {
            action: 'removeAll'
          },
          next: 'askRemoveUserAllOpt'
        }
      }]
    }];
    return inquirer.prompt(questions);
  },
  askAddUserOpt: () => {
    const questions = [// claim,
    email // password,
    // displayName
    ];
    return inquirer.prompt(questions);
  },
  askClaim: () => {
    const questions = [claim];
    return inquirer.prompt(questions).then(answer => {
      if (answer.claim === 'askCustomClaim') {
        return module.exports.askCustomClaim();
      }

      return answer;
    });
  },
  askCustomClaim: () => {
    const questions = [{
      name: 'claim',
      type: 'input',
      message: 'Enter Role:',
      validate: function (value) {
        if (value.length) {
          return true;
        } else {
          return 'Please enter a Role name';
        }
      }
    }];
    return inquirer.prompt(questions);
  },
  askEmail: () => {
    const questions = [email];
    return inquirer.prompt(questions);
  },
  askPassword: () => {
    const questions = [password];
    return inquirer.prompt(questions);
  },
  askDisplayName: () => {
    const questions = [displayName];
    return inquirer.prompt(questions);
  },
  askVerifyEmail: () => {
    const questions = [emailVerified];
    return inquirer.prompt(questions);
  },
  askShowUserOpt: () => {
    const questions = [uid];
    return inquirer.prompt(questions);
  },
  askUpdateUserOpt: () => {
    const questions = [uid, {
      name: 'runNext',
      type: 'list',
      message: 'What do you want to update:',
      choices: [{
        name: 'Claim Roles',
        value: {
          extra: {
            change: 'claim'
          },
          next: 'askClaim'
        }
      }, {
        name: 'Email',
        value: {
          extra: {
            change: 'email'
          },
          next: 'askEmail'
        }
      }, {
        name: 'Password',
        value: {
          extra: {
            change: 'password'
          },
          next: 'askPassword'
        }
      }, {
        name: 'Display Name',
        value: {
          extra: {
            change: 'displayName'
          },
          next: 'askDisplayName'
        }
      }, {
        name: 'Verify Email',
        value: {
          extra: {
            change: 'emailVerified'
          },
          next: 'askVerifyEmail'
        }
      }]
    }];
    return inquirer.prompt(questions);
  },
  askAddUserFileCsvOpt: () => {
    const questions = [claim, {
      name: 'file',
      type: 'input',
      message: 'Enter filename:',
      validate: function (value) {
        if (value.length) {
          return true;
        } else {
          return 'Please enter a file name';
        }
      }
    }];
    return inquirer.prompt(questions);
  },
  askAddUserFileOpt: () => {
    const questions = [claim, {
      name: 'file',
      type: 'input',
      message: 'Enter filename:',
      validate: function (value) {
        if (value.length) {
          return true;
        } else {
          return 'Please enter a file name';
        }
      }
    }];
    return inquirer.prompt(questions);
  },
  askRemoveUserOpt: () => {
    const questions = [uid];
    return inquirer.prompt(questions);
  },
  askRemoveUserAllOpt: () => {
    const questions = [{
      name: 'deleteAllVerified',
      type: 'confirm',
      message: 'Are you sure?',
      validate: function (value) {
        if (value === 'yes') {
          return true;
        }

        return false;
      }
    }];
    return inquirer.prompt(questions);
  }
};