// server/postman/build-collection.js
// Run: node postman/build-collection.js
// Outputs: postman/collections/server-api/collection.json

const fs = require('fs');
const path = require('path');

// ─── Helpers ────────────────────────────────────────────────────────────────

function jsonHeader() {
  return [{ key: 'Content-Type', value: 'application/json' }];
}

function makeUrl(raw) {
  return { raw };
}

function makeBody(obj) {
  return {
    mode: 'raw',
    raw: JSON.stringify(obj, null, 2),
    options: { raw: { language: 'json' } },
  };
}

function makeItem({ name, method, url, headers = [], body = null, tests = [], preRequest = [] }) {
  const item = {
    name,
    request: {
      method,
      header: headers,
      url: makeUrl(url),
    },
    event: [],
  };
  if (body !== null) item.request.body = makeBody(body);
  if (preRequest.length) {
    item.event.push({ listen: 'prerequest', script: { exec: preRequest, type: 'text/javascript' } });
  }
  if (tests.length) {
    item.event.push({ listen: 'test', script: { exec: tests, type: 'text/javascript' } });
  }
  return item;
}

function loginRequest(role) {
  const label = role.charAt(0).toUpperCase() + role.slice(1);
  return makeItem({
    name: `🔐 Login as ${label}`,
    method: 'POST',
    url: '{{baseUrl}}/auth/login',
    headers: jsonHeader(),
    body: { mail: `{{${role}Mail}}`, password: `{{${role}Password}}` },
    tests: [
      "pm.test('Login OK', () => pm.response.to.have.status(200));",
    ],
  });
}

// ─── AUTH MODULE ─────────────────────────────────────────────────────────────

const authFolder = {
  name: 'Auth',
  item: [
    makeItem({
      name: 'Register',
      method: 'POST',
      url: '{{baseUrl}}/auth/register',
      headers: jsonHeader(),
      body: { mail: '{{newUserMail}}', password: '{{newUserPassword}}' },
      tests: [
        "pm.test('Status 201', () => pm.response.to.have.status(201));",
        "const json = pm.response.json();",
        "pm.test('Has message', () => pm.expect(json.message).to.be.a('string'));",
      ],
    }),
    makeItem({
      name: 'Register - duplicate email returns 409',
      method: 'POST',
      url: '{{baseUrl}}/auth/register',
      headers: jsonHeader(),
      body: { mail: '{{newUserMail}}', password: '{{newUserPassword}}' },
      tests: [
        "pm.test('Status 409 on duplicate', () => pm.response.to.have.status(409));",
      ],
    }),
    makeItem({
      name: 'Login (professor)',
      method: 'POST',
      url: '{{baseUrl}}/auth/login',
      headers: jsonHeader(),
      body: { mail: '{{professorMail}}', password: '{{professorPassword}}' },
      tests: [
        "pm.test('Status 200', () => pm.response.to.have.status(200));",
        "const json = pm.response.json();",
        "pm.test('Has message', () => pm.expect(json.message).to.equal('Login successful'));",
        "pm.test('hasProfile is boolean', () => pm.expect(json.hasProfile).to.be.a('boolean'));",
        "pm.test('hasGroup is boolean', () => pm.expect(json.hasGroup).to.be.a('boolean'));",
      ],
    }),
    makeItem({
      name: 'Login - wrong password returns 401',
      method: 'POST',
      url: '{{baseUrl}}/auth/login',
      headers: jsonHeader(),
      body: { mail: '{{professorMail}}', password: 'WrongPassword1!' },
      tests: [
        "pm.test('Status 401 on bad password', () => pm.response.to.have.status(401));",
      ],
    }),
    makeItem({
      name: 'Login - unknown email returns 404',
      method: 'POST',
      url: '{{baseUrl}}/auth/login',
      headers: jsonHeader(),
      body: { mail: 'nobody@nowhere.com', password: 'Test@1234!' },
      tests: [
        "pm.test('Status 404 on unknown email', () => pm.response.to.have.status(404));",
      ],
    }),
    makeItem({
      name: 'Logout',
      method: 'POST',
      url: '{{baseUrl}}/auth/logout',
      tests: [
        "pm.test('Status 200', () => pm.response.to.have.status(200));",
        "const json = pm.response.json();",
        "pm.test('Has logout message', () => pm.expect(json.message).to.be.a('string'));",
      ],
    }),
  ],
};

// ─── USER MODULE ─────────────────────────────────────────────────────────────

const userFolder = {
  name: 'User',
  item: [
    loginRequest('admin'),
    makeItem({
      name: 'Create User Profile (admin)',
      method: 'POST',
      url: '{{baseUrl}}/user/create',
      headers: jsonHeader(),
      body: {
        name: 'Test', lastName: 'Testerson', username: 'testerson_api_001',
        description: 'A test user', gender: 'M', idCard: '1234567890',
        degree: 'Artes Plásticas', semester: 4, telNumber: '3001234567',
        isProfesor: false, userTypeId: '00000000-0000-0000-0000-000000000003',
      },
      tests: [
        "pm.test('Status 201', () => pm.response.to.have.status(201));",
        "const json = pm.response.json();",
        "pm.test('Has uid', () => pm.expect(json.uid).to.be.a('string'));",
        "pm.environment.set('createdUserId', json.uid);",
      ],
    }),
    makeItem({
      name: 'Get All Active Users (admin)',
      method: 'GET', url: '{{baseUrl}}/user/allActive',
      tests: [
        "pm.test('Status 200', () => pm.response.to.have.status(200));",
        "pm.test('Returns array', () => pm.expect(pm.response.json()).to.be.an('array'));",
      ],
    }),
    makeItem({
      name: 'Get Me (admin)',
      method: 'GET', url: '{{baseUrl}}/user/me',
      tests: ["pm.test('Status 200', () => pm.response.to.have.status(200));"],
    }),
    makeItem({
      name: 'Get Author Info (public)',
      method: 'GET', url: '{{baseUrl}}/user/author/{{createdUserId}}',
      tests: [
        "pm.test('Status 200', () => pm.response.to.have.status(200));",
        "pm.test('Has name', () => pm.expect(pm.response.json().name).to.be.a('string'));",
      ],
    }),
    makeItem({
      name: 'Get User by UID (public)',
      method: 'GET', url: '{{baseUrl}}/user/{{createdUserId}}',
      tests: ["pm.test('Status 200', () => pm.response.to.have.status(200));"],
    }),
    makeItem({
      name: 'Get User by UID - 404',
      method: 'GET', url: '{{baseUrl}}/user/00000000-0000-0000-0000-000000000000',
      tests: ["pm.test('Status 404', () => pm.response.to.have.status(404));"],
    }),
    makeItem({
      name: 'Update User by UID (admin)',
      method: 'PUT', url: '{{baseUrl}}/user/{{createdUserId}}',
      headers: jsonHeader(), body: { name: 'TestUpdated', lastName: 'Testerson' },
      tests: [
        "pm.test('Status 200', () => pm.response.to.have.status(200));",
        "pm.test('Name updated', () => pm.expect(pm.response.json().name).to.equal('TestUpdated'));",
      ],
    }),
    makeItem({
      name: 'Deactivate User by UID (admin)',
      method: 'PATCH', url: '{{baseUrl}}/user/{{createdUserId}}/desactivate',
      tests: ["pm.test('Status 200', () => pm.response.to.have.status(200));"],
    }),
    makeItem({
      name: 'Reactivate User by UID (admin)',
      method: 'PATCH', url: '{{baseUrl}}/user/{{createdUserId}}/reactivate',
      tests: ["pm.test('Status 200', () => pm.response.to.have.status(200));"],
    }),
    loginRequest('professor'),
    makeItem({
      name: 'Update Current User (professor)',
      method: 'PUT', url: '{{baseUrl}}/user/update',
      headers: jsonHeader(), body: { name: 'Profesor', lastName: 'Actualizado', semester: 8 },
      tests: [
        "pm.test('Status 200', () => pm.response.to.have.status(200));",
        "pm.test('Name updated', () => pm.expect(pm.response.json().name).to.equal('Profesor'));",
      ],
    }),
    makeItem({
      name: 'Get All Active - 403 for professor',
      method: 'GET', url: '{{baseUrl}}/user/allActive',
      tests: ["pm.test('Status 403', () => pm.response.to.have.status(403));"],
    }),
    loginRequest('student'),
    makeItem({
      name: 'Deactivate Current User (student)',
      method: 'PATCH', url: '{{baseUrl}}/user/desactivate',
      tests: ["pm.test('Status 200', () => pm.response.to.have.status(200));"],
    }),
    loginRequest('admin'),
  ],
};

// ─── GROUPS MODULE ────────────────────────────────────────────────────────────

const groupsFolder = {
  name: 'Groups',
  item: [
    loginRequest('admin'),
    makeItem({
      name: 'Create Group',
      method: 'POST', url: '{{baseUrl}}/groups/create',
      headers: jsonHeader(),
      body: { name: 'Grupo Test 2026', profesorId: '00000000-0000-0000-0000-000000000020', users: [] },
      tests: [
        "pm.test('Status 201', () => pm.response.to.have.status(201));",
        "const json = pm.response.json();",
        "pm.test('Has uid', () => pm.expect(json.uid).to.be.a('string'));",
        "pm.environment.set('groupId', json.uid);",
      ],
    }),
    makeItem({
      name: 'Get All Groups',
      method: 'GET', url: '{{baseUrl}}/groups/get?page=1&limit=10',
      tests: [
        "pm.test('Status 200', () => pm.response.to.have.status(200));",
        "const json = pm.response.json();",
        "pm.test('Has data array', () => pm.expect(json.data).to.be.an('array'));",
        "pm.test('Has total', () => pm.expect(json.total).to.be.a('number'));",
      ],
    }),
    makeItem({
      name: 'Get Group by UID',
      method: 'GET', url: '{{baseUrl}}/groups/get/{{groupId}}',
      tests: [
        "pm.test('Status 200', () => pm.response.to.have.status(200));",
        "pm.test('UID matches', () => pm.expect(pm.response.json().uid).to.equal(pm.environment.get('groupId')));",
      ],
    }),
    makeItem({
      name: 'Update Group',
      method: 'PUT', url: '{{baseUrl}}/groups/update/{{groupId}}',
      headers: jsonHeader(), body: { name: 'Grupo Test Actualizado 2026' },
      tests: [
        "pm.test('Status 200', () => pm.response.to.have.status(200));",
        "pm.test('Name updated', () => pm.expect(pm.response.json().name).to.equal('Grupo Test Actualizado 2026'));",
      ],
    }),
    makeItem({
      name: 'Change Group Profesor',
      method: 'PATCH', url: '{{baseUrl}}/groups/change-profesor/{{groupId}}',
      headers: jsonHeader(), body: { newProfesorId: '00000000-0000-0000-0000-000000000020' },
      tests: ["pm.test('Status 200', () => pm.response.to.have.status(200));"],
    }),
    makeItem({
      name: 'Add Student to Group',
      method: 'POST', url: '{{baseUrl}}/groups/student/add',
      headers: jsonHeader(),
      body: { userId: '00000000-0000-0000-0000-000000000030', groupIds: ['{{groupId}}'] },
      tests: ["pm.test('Status 200 or 201', () => pm.expect(pm.response.code).to.be.oneOf([200, 201]));"],
    }),
    makeItem({
      name: 'Get Students by Group',
      method: 'GET', url: '{{baseUrl}}/groups/student/get/{{groupId}}',
      tests: [
        "pm.test('Status 200', () => pm.response.to.have.status(200));",
        "pm.test('Returns array', () => pm.expect(pm.response.json()).to.be.an('array'));",
      ],
    }),
    makeItem({
      name: 'Update Students in Group',
      method: 'PUT', url: '{{baseUrl}}/groups/student/update/{{groupId}}',
      headers: jsonHeader(), body: { users: ['00000000-0000-0000-0000-000000000030'] },
      tests: ["pm.test('Status 200', () => pm.response.to.have.status(200));"],
    }),
    makeItem({
      name: 'Delete Student from Group',
      method: 'DELETE', url: '{{baseUrl}}/groups/student/delete/{{groupId}}',
      headers: jsonHeader(), body: { userId: '00000000-0000-0000-0000-000000000030' },
      tests: ["pm.test('Status 200', () => pm.response.to.have.status(200));"],
    }),
    makeItem({
      name: 'Delete All Students from Group',
      method: 'DELETE', url: '{{baseUrl}}/groups/student/deleteAll/{{groupId}}',
      tests: ["pm.test('Status 200', () => pm.response.to.have.status(200));"],
    }),
    makeItem({
      name: 'Delete Group',
      method: 'DELETE', url: '{{baseUrl}}/groups/delete/{{groupId}}',
      tests: ["pm.test('Status 200', () => pm.response.to.have.status(200));"],
    }),
    makeItem({
      name: 'Create Group (downstream)',
      method: 'POST', url: '{{baseUrl}}/groups/create',
      headers: jsonHeader(),
      body: { name: 'Grupo Downstream 2026', profesorId: '00000000-0000-0000-0000-000000000020', users: ['00000000-0000-0000-0000-000000000030'] },
      tests: [
        "pm.test('Status 201', () => pm.response.to.have.status(201));",
        "pm.environment.set('groupId', pm.response.json().uid);",
      ],
    }),
  ],
};

// ─── PHOTOS MODULE ────────────────────────────────────────────────────────────

const TINY_BASE64 = '/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgUEB//EAB8QAAIBBAMBAAAAAAAAAAAAAAECAwQFERIhMf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCw1mozLsuoKMKOp06UrqWt5G7SMi6oifdKj9IqpuAAAAAAAAAAAAB//9k=';

const photosFolder = {
  name: 'Photos',
  item: [
    makeItem({
      name: 'Create Photo',
      method: 'POST', url: '{{baseUrl}}/photos/create',
      headers: jsonHeader(),
      body: { base64: TINY_BASE64, name: 'test-photo.jpg', folder: 'products' },
      tests: [
        "pm.test('Status 201', () => pm.response.to.have.status(201));",
        "const json = pm.response.json();",
        "pm.test('Has uid', () => pm.expect(json.uid).to.be.a('string'));",
        "pm.environment.set('photoId', json.uid);",
      ],
    }),
    makeItem({
      name: 'Get Photo by UID',
      method: 'GET', url: '{{baseUrl}}/photos/get/{{photoId}}',
      tests: [
        "pm.test('Status 200', () => pm.response.to.have.status(200));",
        "const json = pm.response.json();",
        "pm.test('UID matches', () => pm.expect(json.uid).to.equal(pm.environment.get('photoId')));",
        "pm.test('Has base64', () => pm.expect(json.base64).to.be.a('string'));",
      ],
    }),
    makeItem({
      name: 'Edit Photo',
      method: 'PUT', url: '{{baseUrl}}/photos/edit/{{photoId}}',
      headers: jsonHeader(), body: { base64: TINY_BASE64 },
      tests: ["pm.test('Status 200', () => pm.response.to.have.status(200));"],
    }),
    makeItem({
      name: 'Get Photo - 404',
      method: 'GET', url: '{{baseUrl}}/photos/get/00000000-0000-0000-0000-000000000000',
      tests: ["pm.test('Status 404', () => pm.response.to.have.status(404));"],
    }),
  ],
};

// ─── PRODUCTS MODULE ──────────────────────────────────────────────────────────

const productsFolder = {
  name: 'Products',
  item: [
    loginRequest('professor'),
    makeItem({
      name: 'Create Product',
      method: 'POST', url: '{{baseUrl}}/products/create',
      headers: jsonHeader(),
      body: {
        name: 'Obra de Prueba', description: 'Descripción de prueba', price: 50000,
        madeAt: '2026-01-15', groupId: '{{groupId}}', isSold: false,
        authors: [{ userId: '00000000-0000-0000-0000-000000000020', isAuthor: true }],
        styles: [],
        images: [{ base64: '/9j/4AAQSkZJRgABAQEASABIAAD/', name: 'obra.jpg', folder: 'products', isMain: true }],
      },
      tests: [
        "pm.test('Status 201', () => pm.response.to.have.status(201));",
        "const json = pm.response.json();",
        "pm.test('Has uid', () => pm.expect(json.uid).to.be.a('string'));",
        "pm.test('Status PENDING', () => pm.expect(json.status).to.equal('PENDING'));",
        "pm.environment.set('productId', json.uid);",
      ],
    }),
    makeItem({
      name: 'Get Gallery Home (public)',
      method: 'GET', url: '{{baseUrl}}/products/getGalleryHome?page=1&limit=10',
      tests: [
        "pm.test('Status 200', () => pm.response.to.have.status(200));",
        "pm.test('Has data', () => pm.expect(pm.response.json().data).to.be.an('array'));",
      ],
    }),
    makeItem({
      name: 'Get Products by Author (public)',
      method: 'GET', url: '{{baseUrl}}/products/getAuthor/00000000-0000-0000-0000-000000000020?page=1&limit=10',
      tests: [
        "pm.test('Status 200', () => pm.response.to.have.status(200));",
        "pm.test('Has data', () => pm.expect(pm.response.json().data).to.be.an('array'));",
      ],
    }),
    makeItem({
      name: 'Get Product by UID (public)',
      method: 'GET', url: '{{baseUrl}}/products/get/{{productId}}',
      tests: [
        "pm.test('Status 200', () => pm.response.to.have.status(200));",
        "const json = pm.response.json();",
        "pm.test('UID matches', () => pm.expect(json.uid).to.equal(pm.environment.get('productId')));",
      ],
    }),
    makeItem({
      name: 'Update Product Status - REJECTED without feedback returns 400',
      method: 'PATCH', url: '{{baseUrl}}/products/status/{{productId}}',
      headers: jsonHeader(), body: { status: 'REJECTED' },
      tests: ["pm.test('Status 400', () => pm.response.to.have.status(400));"],
    }),
    makeItem({
      name: 'Update Product Status - APPROVED (professor)',
      method: 'PATCH', url: '{{baseUrl}}/products/status/{{productId}}',
      headers: jsonHeader(), body: { status: 'APPROVED' },
      tests: [
        "pm.test('Status 200', () => pm.response.to.have.status(200));",
        "pm.test('Status APPROVED', () => pm.expect(pm.response.json().status).to.equal('APPROVED'));",
      ],
    }),
    makeItem({
      name: 'Approve Many Products (professor)',
      method: 'PUT', url: '{{baseUrl}}/products/approveMany',
      headers: jsonHeader(), body: { productIds: ['{{productId}}'] },
      tests: [
        "pm.test('Status 200', () => pm.response.to.have.status(200));",
        "pm.test('Has approved', () => pm.expect(pm.response.json().approved).to.be.an('array'));",
      ],
    }),
    makeItem({
      name: 'Update Product (professor)',
      method: 'PUT', url: '{{baseUrl}}/products/update/{{productId}}',
      headers: jsonHeader(),
      body: { name: 'Obra Actualizada', description: 'Descripción actualizada', images: [] },
      tests: [
        "pm.test('Status 200', () => pm.response.to.have.status(200));",
        "pm.test('Name updated', () => pm.expect(pm.response.json().name).to.equal('Obra Actualizada'));",
      ],
    }),
    loginRequest('admin'),
    makeItem({
      name: 'Get All Products (admin)',
      method: 'GET', url: '{{baseUrl}}/products/getAll?page=1&limit=10',
      tests: [
        "pm.test('Status 200', () => pm.response.to.have.status(200));",
        "pm.test('Has data', () => pm.expect(pm.response.json().data).to.be.an('array'));",
      ],
    }),
    makeItem({
      name: 'Get Products by Group (admin)',
      method: 'GET', url: '{{baseUrl}}/products/getGroup/{{groupId}}?page=1&limit=10',
      tests: [
        "pm.test('Status 200', () => pm.response.to.have.status(200));",
        "pm.test('Has data', () => pm.expect(pm.response.json().data).to.be.an('array'));",
      ],
    }),
  ],
};

// ─── STYLES MODULE ────────────────────────────────────────────────────────────

const stylesFolder = {
  name: 'Styles',
  item: [
    makeItem({
      name: 'Get All Styles (public)',
      method: 'GET', url: '{{baseUrl}}/styles/all',
      tests: [
        "pm.test('Status 200', () => pm.response.to.have.status(200));",
        "pm.test('Returns array', () => pm.expect(pm.response.json()).to.be.an('array'));",
      ],
    }),
    makeItem({
      name: 'Get Styles by Group (public)',
      method: 'GET', url: '{{baseUrl}}/styles/all/{{groupId}}',
      tests: [
        "pm.test('Status 200', () => pm.response.to.have.status(200));",
        "pm.test('Returns array', () => pm.expect(pm.response.json()).to.be.an('array'));",
      ],
    }),
    loginRequest('professor'),
    makeItem({
      name: 'Create Style (professor)',
      method: 'POST', url: '{{baseUrl}}/styles/create',
      headers: jsonHeader(),
      body: { name: 'Impresionismo Test', description: 'Estilo de prueba', groupId: '{{groupId}}' },
      tests: [
        "pm.test('Status 201', () => pm.response.to.have.status(201));",
        "const json = pm.response.json();",
        "pm.test('Has uid', () => pm.expect(json.uid).to.be.a('string'));",
        "pm.test('Name correct', () => pm.expect(json.name).to.equal('Impresionismo Test'));",
        "pm.environment.set('styleId', json.uid);",
      ],
    }),
    makeItem({
      name: 'Get Style by UID (public)',
      method: 'GET', url: '{{baseUrl}}/styles/get/{{styleId}}',
      tests: [
        "pm.test('Status 200', () => pm.response.to.have.status(200));",
        "pm.test('UID matches', () => pm.expect(pm.response.json().uid).to.equal(pm.environment.get('styleId')));",
      ],
    }),
    makeItem({
      name: 'Update Style (professor)',
      method: 'PUT', url: '{{baseUrl}}/styles/update/{{styleId}}',
      headers: jsonHeader(), body: { name: 'Impresionismo Actualizado', description: 'Actualizado' },
      tests: [
        "pm.test('Status 200', () => pm.response.to.have.status(200));",
        "pm.test('Name updated', () => pm.expect(pm.response.json().name).to.equal('Impresionismo Actualizado'));",
      ],
    }),
    makeItem({
      name: 'Delete Style - 403 for professor',
      method: 'DELETE', url: '{{baseUrl}}/styles/delete/{{styleId}}',
      tests: ["pm.test('Status 403', () => pm.response.to.have.status(403));"],
    }),
    loginRequest('admin'),
    makeItem({
      name: 'Delete Style (admin)',
      method: 'DELETE', url: '{{baseUrl}}/styles/delete/{{styleId}}',
      tests: ["pm.test('Status 200', () => pm.response.to.have.status(200));"],
    }),
    makeItem({
      name: 'Get Style - 404 after delete',
      method: 'GET', url: '{{baseUrl}}/styles/get/{{styleId}}',
      tests: ["pm.test('Status 404', () => pm.response.to.have.status(404));"],
    }),
  ],
};

// ─── EVENTS MODULE ────────────────────────────────────────────────────────────

const eventsFolder = {
  name: 'Events',
  item: [
    makeItem({
      name: 'Get Upcoming Events (public)',
      method: 'GET', url: '{{baseUrl}}/events/upcoming?page=1&limit=10',
      tests: [
        "pm.test('Status 200', () => pm.response.to.have.status(200));",
        "pm.test('Has data', () => pm.expect(pm.response.json().data).to.be.an('array'));",
      ],
    }),
    makeItem({
      name: 'Get Past Events (public)',
      method: 'GET', url: '{{baseUrl}}/events/past?page=1&limit=10',
      tests: [
        "pm.test('Status 200', () => pm.response.to.have.status(200));",
        "pm.test('Has data', () => pm.expect(pm.response.json().data).to.be.an('array'));",
      ],
    }),
    makeItem({
      name: 'Get Events Home (public)',
      method: 'GET', url: '{{baseUrl}}/events/home?page=1&limit=5',
      tests: [
        "pm.test('Status 200', () => pm.response.to.have.status(200));",
        "pm.test('Has data', () => pm.expect(pm.response.json().data).to.be.an('array'));",
      ],
    }),
    makeItem({
      name: 'Get Events by Group (public)',
      method: 'GET', url: '{{baseUrl}}/events/getByGroup/{{groupId}}?page=1&limit=10',
      tests: [
        "pm.test('Status 200', () => pm.response.to.have.status(200));",
        "pm.test('Has data', () => pm.expect(pm.response.json().data).to.be.an('array'));",
      ],
    }),
    loginRequest('professor'),
    makeItem({
      name: 'Get Available Products for Group (professor)',
      method: 'GET', url: '{{baseUrl}}/events/available-products/{{groupId}}',
      tests: [
        "pm.test('Status 200', () => pm.response.to.have.status(200));",
        "pm.test('Returns array', () => pm.expect(pm.response.json()).to.be.an('array'));",
      ],
    }),
    makeItem({
      name: 'Create Event (professor)',
      method: 'POST', url: '{{baseUrl}}/events/create',
      headers: jsonHeader(),
      body: {
        name: 'Exposición de Arte Test',
        description: 'Evento de prueba para test suite',
        eventType: 'EXHIBITION',
        startDate: '2026-06-15T10:00:00.000Z',
        endDate: '2026-06-15T18:00:00.000Z',
        locationUrl: 'https://maps.example.com/usta',
        isVirtual: false,
        createdById: '00000000-0000-0000-0000-000000000020',
        groupIds: ['{{groupId}}'],
        productIds: [],
        coverPhoto: null,
      },
      tests: [
        "pm.test('Status 201', () => pm.response.to.have.status(201));",
        "const json = pm.response.json();",
        "pm.test('Has uid', () => pm.expect(json.uid).to.be.a('string'));",
        "pm.test('Status PENDING', () => pm.expect(json.status).to.equal('PENDING'));",
        "pm.environment.set('eventId', json.uid);",
      ],
    }),
    makeItem({
      name: 'Get Event by UID (public)',
      method: 'GET', url: '{{baseUrl}}/events/get/{{eventId}}',
      tests: [
        "pm.test('Status 200', () => pm.response.to.have.status(200));",
        "const json = pm.response.json();",
        "pm.test('Has uid', () => pm.expect(json.uid).to.equal(pm.environment.get('eventId')));",
      ],
    }),
    makeItem({
      name: 'Update Event (professor)',
      method: 'PUT', url: '{{baseUrl}}/events/update/{{eventId}}',
      headers: jsonHeader(),
      body: { name: 'Exposición Actualizada', description: 'Descripción actualizada' },
      tests: [
        "pm.test('Status 200', () => pm.response.to.have.status(200));",
        "const json = pm.response.json();",
        "pm.test('Name updated', () => pm.expect(json.name).to.equal('Exposición Actualizada'));",
        "pm.test('Back to PENDING', () => pm.expect(json.status).to.equal('PENDING'));",
      ],
    }),
    makeItem({
      name: 'Update Event Products (professor)',
      method: 'PUT', url: '{{baseUrl}}/events/{{eventId}}/products',
      headers: jsonHeader(),
      body: { productIds: [], groupId: '{{groupId}}' },
      tests: ["pm.test('Status 200', () => pm.response.to.have.status(200));"],
    }),
    makeItem({
      name: 'Get Pending Invitations (professor)',
      method: 'GET', url: '{{baseUrl}}/events/invitations/pending?profesorId=00000000-0000-0000-0000-000000000020',
      tests: [
        "pm.test('Status 200', () => pm.response.to.have.status(200));",
        "pm.test('Returns array', () => pm.expect(pm.response.json()).to.be.an('array'));",
      ],
    }),
    loginRequest('admin'),
    makeItem({
      name: 'Get All Events (admin)',
      method: 'GET', url: '{{baseUrl}}/events/getAll?page=1&limit=10',
      tests: [
        "pm.test('Status 200', () => pm.response.to.have.status(200));",
        "pm.test('Has data', () => pm.expect(pm.response.json().data).to.be.an('array'));",
      ],
    }),
    makeItem({
      name: 'Update Event Status - APPROVED (admin)',
      method: 'PATCH', url: '{{baseUrl}}/events/status/{{eventId}}',
      headers: jsonHeader(), body: { status: 'APPROVED' },
      tests: [
        "pm.test('Status 200', () => pm.response.to.have.status(200));",
        "pm.test('Status APPROVED', () => pm.expect(pm.response.json().status).to.equal('APPROVED'));",
      ],
    }),
    makeItem({
      name: 'Update Event Status - CANCELLED without feedback returns 400 (admin)',
      method: 'PATCH', url: '{{baseUrl}}/events/status/{{eventId}}',
      headers: jsonHeader(), body: { status: 'CANCELLED' },
      tests: ["pm.test('Status 400 - feedback required', () => pm.response.to.have.status(400));"],
    }),
    makeItem({
      name: 'Send Invitation to Group (admin)',
      method: 'POST', url: '{{baseUrl}}/events/{{eventId}}/invite',
      headers: jsonHeader(), body: { groupId: '{{groupId}}' },
      tests: [
        "pm.test('Status 200 or 201', () => pm.expect(pm.response.code).to.be.oneOf([200, 201]));",
        "const json = pm.response.json();",
        "if (json && json.uid) pm.environment.set('invitationId', json.uid);",
      ],
    }),
    makeItem({
      name: 'Revoke Invitation (admin)',
      method: 'DELETE', url: '{{baseUrl}}/events/{{eventId}}/invite/{{groupId}}',
      tests: ["pm.test('Status 200', () => pm.response.to.have.status(200));"],
    }),
    makeItem({
      name: 'Deactivate Event (admin)',
      method: 'PATCH', url: '{{baseUrl}}/events/deactivate/{{eventId}}',
      tests: ["pm.test('Status 200', () => pm.response.to.have.status(200));"],
    }),
  ],
};

// ─── CLASSES MODULE ───────────────────────────────────────────────────────────

const classesFolder = {
  name: 'Classes',
  item: [
    loginRequest('professor'),
    makeItem({
      name: 'Create Class (professor)',
      method: 'POST', url: '{{baseUrl}}/classes/create',
      headers: jsonHeader(),
      body: {
        groupId: '{{groupId}}',
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        startTime: '08:00',
        endTime: '10:00',
        topic: 'Introducción al color',
      },
      tests: [
        "pm.test('Status 201', () => pm.response.to.have.status(201));",
        "const json = pm.response.json();",
        "pm.test('Has uid', () => pm.expect(json.uid).to.be.a('string'));",
        "pm.test('Has date', () => pm.expect(json.date).to.be.a('string'));",
        "pm.environment.set('classId', json.uid);",
      ],
    }),
    makeItem({
      name: 'Get Classes by Group (professor)',
      method: 'GET', url: '{{baseUrl}}/classes/group/{{groupId}}',
      tests: [
        "pm.test('Status 200', () => pm.response.to.have.status(200));",
        "pm.test('Returns array', () => pm.expect(pm.response.json()).to.be.an('array'));",
      ],
    }),
    makeItem({
      name: 'Get Classes by Group with date filter',
      method: 'GET', url: '{{baseUrl}}/classes/group/{{groupId}}?from=2026-01-01&to=2026-12-31',
      tests: [
        "pm.test('Status 200', () => pm.response.to.have.status(200));",
        "pm.test('Returns array', () => pm.expect(pm.response.json()).to.be.an('array'));",
      ],
    }),
    makeItem({
      name: 'Get Current Class for Group',
      method: 'GET', url: '{{baseUrl}}/classes/current/{{groupId}}',
      tests: [
        "pm.test('Status 200', () => pm.response.to.have.status(200));",
        "const json = pm.response.json();",
        "pm.test('Returns null or object', () => pm.expect(json === null || typeof json === 'object').to.be.true);",
      ],
    }),
    makeItem({
      name: 'Update Class Topic (professor)',
      method: 'PATCH', url: '{{baseUrl}}/classes/{{classId}}/topic',
      headers: jsonHeader(),
      body: { topic: 'Teoría del color avanzada', review: 'Clase productiva' },
      tests: [
        "pm.test('Status 200', () => pm.response.to.have.status(200));",
        "pm.test('Topic updated', () => pm.expect(pm.response.json().topic).to.equal('Teoría del color avanzada'));",
      ],
    }),
    makeItem({
      name: 'Get Class Attendance (professor)',
      method: 'GET', url: '{{baseUrl}}/classes/{{classId}}/attendance',
      tests: [
        "pm.test('Status 200', () => pm.response.to.have.status(200));",
        "pm.test('Returns array', () => pm.expect(pm.response.json()).to.be.an('array'));",
      ],
    }),
    loginRequest('student'),
    makeItem({
      name: 'Attend Class (student)',
      method: 'POST', url: '{{baseUrl}}/classes/attend',
      headers: jsonHeader(), body: { classId: '{{classId}}' },
      tests: [
        "pm.test('Status 201 or 400 (not active)', () => pm.expect(pm.response.code).to.be.oneOf([201, 400]));",
      ],
    }),
    makeItem({
      name: 'Create Class - 403 for student',
      method: 'POST', url: '{{baseUrl}}/classes/create',
      headers: jsonHeader(),
      body: { groupId: '{{groupId}}', date: '2026-06-01', startTime: '08:00', endTime: '10:00' },
      tests: ["pm.test('Status 403', () => pm.response.to.have.status(403));"],
    }),
    loginRequest('admin'),
    makeItem({
      name: 'Get Class Attendance (admin)',
      method: 'GET', url: '{{baseUrl}}/classes/{{classId}}/attendance',
      tests: [
        "pm.test('Status 200', () => pm.response.to.have.status(200));",
        "pm.test('Returns array', () => pm.expect(pm.response.json()).to.be.an('array'));",
      ],
    }),
  ],
};

// ─── SCHEDULE MODULE ──────────────────────────────────────────────────────────

const scheduleFolder = {
  name: 'Schedule',
  item: [
    loginRequest('professor'),
    makeItem({
      name: 'Create Schedule (professor)',
      method: 'POST', url: '{{baseUrl}}/schedule/create',
      headers: jsonHeader(),
      body: { groupId: '{{groupId}}', dayOfWeek: 1, startTime: '14:00', endTime: '16:00' },
      tests: [
        "pm.test('Status 201', () => pm.response.to.have.status(201));",
        "const json = pm.response.json();",
        "pm.test('Has uid', () => pm.expect(json.uid).to.be.a('string'));",
        "pm.test('dayOfWeek correct', () => pm.expect(json.dayOfWeek).to.equal(1));",
        "pm.test('startTime correct', () => pm.expect(json.startTime).to.equal('14:00'));",
        "pm.environment.set('scheduleId', json.uid);",
      ],
    }),
    makeItem({
      name: 'Get Schedules by Group (professor)',
      method: 'GET', url: '{{baseUrl}}/schedule/group/{{groupId}}',
      tests: [
        "pm.test('Status 200', () => pm.response.to.have.status(200));",
        "const json = pm.response.json();",
        "pm.test('Returns array', () => pm.expect(json).to.be.an('array'));",
        "pm.test('Has at least 1 schedule', () => pm.expect(json.length).to.be.at.least(1));",
      ],
    }),
    makeItem({
      name: 'Update Schedule (professor)',
      method: 'PUT', url: '{{baseUrl}}/schedule/{{scheduleId}}',
      headers: jsonHeader(),
      body: { dayOfWeek: 3, startTime: '09:00', endTime: '11:00' },
      tests: [
        "pm.test('Status 200', () => pm.response.to.have.status(200));",
        "const json = pm.response.json();",
        "pm.test('dayOfWeek updated', () => pm.expect(json.dayOfWeek).to.equal(3));",
        "pm.test('startTime updated', () => pm.expect(json.startTime).to.equal('09:00'));",
      ],
    }),
    makeItem({
      name: 'Delete Schedule (professor)',
      method: 'DELETE', url: '{{baseUrl}}/schedule/{{scheduleId}}',
      tests: ["pm.test('Status 200', () => pm.response.to.have.status(200));"],
    }),
    makeItem({
      name: 'Get Schedules - after delete',
      method: 'GET', url: '{{baseUrl}}/schedule/group/{{groupId}}',
      tests: [
        "pm.test('Status 200', () => pm.response.to.have.status(200));",
        "pm.test('Returns array', () => pm.expect(pm.response.json()).to.be.an('array'));",
      ],
    }),
    loginRequest('student'),
    makeItem({
      name: 'Create Schedule - 403 for student',
      method: 'POST', url: '{{baseUrl}}/schedule/create',
      headers: jsonHeader(),
      body: { groupId: '{{groupId}}', dayOfWeek: 2, startTime: '10:00', endTime: '12:00' },
      tests: ["pm.test('Status 403', () => pm.response.to.have.status(403));"],
    }),
    makeItem({
      name: 'Get Schedules - 403 for student',
      method: 'GET', url: '{{baseUrl}}/schedule/group/{{groupId}}',
      tests: ["pm.test('Status 403', () => pm.response.to.have.status(403));"],
    }),
  ],
};

// ─── COLLECTION ASSEMBLY ─────────────────────────────────────────────────────

const collection = {
  info: {
    _postman_id: 'usta-gallery-api-tests',
    name: 'UstaGallery API Tests',
    description: 'Full Newman test suite — Auth, User, Groups, Photos, Products, Styles, Events, Classes, Schedule',
    schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
  },
  item: [authFolder, userFolder, groupsFolder, photosFolder, productsFolder, stylesFolder, eventsFolder, classesFolder, scheduleFolder],
};

const outPath = path.join(__dirname, 'collections', 'server-api', 'collection.json');
fs.writeFileSync(outPath, JSON.stringify(collection, null, 2));
console.log(`Collection written to ${outPath}`);
console.log(`Folders: ${collection.item.map(f => f.name).join(', ')}`);
