const Mock = require('mockjs');
const mockPeople = Mock.mock({
  'peoples|5000': [
    {
      'id|+1': 1,
      guid: '@guid',
      name: '@cname',
      age: '@integer(20, 50)',
      birthday: '@date("MM-dd")',
      address: '@county(true)',
      email: '@email',
    },
  ],
});
module.exports = {
  people: mockPeople,
};
