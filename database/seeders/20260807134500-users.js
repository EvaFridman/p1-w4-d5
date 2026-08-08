'use strict';

const { faker } = require('@faker-js/faker/locale/ru');

module.exports = {
  async up(queryInterface, Sequelize) {
    faker.seed(2026);
    const now = new Date();

    const usedEmails = new Set();
    const usedPhones = new Set();

    const users = Array.from({ length: 200 }, () => {
      let email;
      do { email = faker.internet.email(); } while (usedEmails.has(email));
      usedEmails.add(email);

      let phone;
      do { phone = faker.helpers.fromRegExp(/^\+[1-9]\d{10}$/);} while (usedPhones.has(phone));
      usedPhones.add(phone);

      return {
        name: faker.person.fullName(),
        email: email,
        phone: phone,
        ...(faker.datatype.boolean({ probability: 0.9 }) && { 
          role: faker.helpers.arrayElement(['agent', 'moderator'])
        }),
        createdAt: now,
        updatedAt: now,
      };
    });

    await queryInterface.bulkInsert('Users', users, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  },
};