const { test, expect } = require('@playwright/test');
const Ajv = require('ajv');
const fs = require('fs');
const schema = require('./schema1.json');

test('GET List Users - Validate API Response against the JSON schema', async ({ request }) => {
  const response = await request.get('https://reqres.in/api/users?page=2');
  expect(response.status()).toBe(200);
  const responseBody = await response.json();
  const ajv = new Ajv();
  const validate = ajv.compile(schema);
  const valid = validate(responseBody);
  expect(valid).toBe(true);
});

test('GET Single User - Validate API Response', async ({ request }) => {
  const response = await request.get('https://reqres.in/api/users/2');
  const data = await response.json();
  expect(response.status()).toBe(200);

  const user = data.data;
  expect(typeof user.id).toBe('number');
  expect(typeof user.email).toBe('string');
  expect(typeof user.first_name).toBe('string');
  expect(typeof user.last_name).toBe('string');
  expect(typeof user.avatar).toBe('string');

  expect(typeof data.support.url).toBe('string');
  expect(typeof data.support.text).toBe('string');
});

test('GET Single User Not Found - Validate API Response', async ({ request }) => {
  const response = await request.get('https://reqres.in/api/users/23');
  const data = await response.json();
  expect(response.status()).toBe(404);
});

test('GET List Resourses - Validate API Response', async ({ request }) => {
  const response = await request.get('https://reqres.in/api/unknown');
  const data = await response.json();
  expect(response.status()).toBe(200);

  expect(typeof data.page).toBe('number');
  expect(typeof data.per_page).toBe('number');
  expect(typeof data.total).toBe('number');
  expect(typeof data.total_pages).toBe('number');
  expect(Array.isArray(data.data)).toBe(true);

  if (data.data.length > 0) {
    const firstUser = data.data[0];
    expect(typeof firstUser.id).toBe('number');
    expect(typeof firstUser.name).toBe('string');
    expect(typeof firstUser.year).toBe('number');
    expect(typeof firstUser.color).toBe('string');
    expect(typeof firstUser.pantone_value).toBe('string');
  }

  expect(typeof data.support.url).toBe('string');
  expect(typeof data.support.text).toBe('string');

});

test('GET Single Resourses - Validate API Response', async ({ request }) => {
  const response = await request.get('https://reqres.in/api/unknown/2');
  const data = await response.json();
  expect(response.status()).toBe(200);

  const user = data.data;
  expect(typeof user.id).toBe('number');
  expect(typeof user.name).toBe('string');
  expect(typeof user.year).toBe('number');
  expect(typeof user.color).toBe('string');
  expect(typeof user.pantone_value).toBe('string');

  expect(typeof data.support.url).toBe('string');
  expect(typeof data.support.text).toBe('string');

});

test('GET Single Resourses Not Found - Validate API Response', async ({ request }) => {
  const response = await request.get('https://reqres.in/api/users/unknown/23');
  const data = await response.json();
  expect(response.status()).toBe(404);

});

test('GET Delayed Response - Validate API Response', async ({ request }) => {
  const response = await request.get('https://reqres.in/api/users?delay=3');
  const data = await response.json();
  expect(response.status()).toBe(200);

  expect(typeof data.page).toBe('number');
  expect(typeof data.per_page).toBe('number');
  expect(typeof data.total).toBe('number');
  expect(typeof data.total_pages).toBe('number');
  expect(Array.isArray(data.data)).toBe(true);

  if (data.data.length > 0) {
    const firstUser = data.data[0];
    expect(typeof firstUser.id).toBe('number');
    expect(typeof firstUser.email).toBe('string');
    expect(typeof firstUser.first_name).toBe('string');
    expect(typeof firstUser.last_name).toBe('string');
    expect(typeof firstUser.avatar).toBe('string');
  }

  expect(typeof data.support.url).toBe('string');
  expect(typeof data.support.text).toBe('string');

});
test('POST Create - Validate API Response', async ({ request }) => {
  const requestBody = {
    name: "morpheus",
    job: "leader"
  };
  const response = await request.post('https://reqres.in/api/users', {
    data: requestBody,
  });
  const data = await response.json();
  expect(response.status()).toBe(201);

  const responseBody = await response.json();
  expect(responseBody.name).toBe('morpheus');
  expect(responseBody.job).toBe('leader');
  expect(typeof responseBody.id).toBe('string');
  expect(responseBody).toHaveProperty('createdAt');
});
test('POST Register Succesfully - Validate API Response', async ({ request }) => {
  const requestBody = {
    email: 'eve.holt@reqres.in',
    password: 'pistol'
  };
  const response = await request.post('https://reqres.in/api/register', {
    data: requestBody
  });
  expect(response.status()).toBe(200);
  const responseBody = await response.json();
  expect(responseBody).toHaveProperty('id');
  expect(responseBody).toHaveProperty('token');
  expect(responseBody.token).toBe('QpwL5tke4Pnpja7X4');
});


test('POST Register Unsuccesfully - Validate API Response', async ({ request }) => {
  const requestBody = {
    email: 'sydney@fife'
  };
  const response = await request.post('https://reqres.in/api/register', {
    data: requestBody
  });
  expect(response.status()).toBe(400);
  const responseBody = await response.json();
  expect(responseBody).toHaveProperty('error');
  expect(responseBody.error).toBe('Missing password');
});

test('POST Login Succesfully - Validate API Response', async ({ request }) => {
  const requestBody = {
    email: 'eve.holt@reqres.in',
    password: 'cityslicka'
  };
  const response = await request.post('https://reqres.in/api/login', {
    data: requestBody
  });
  expect(response.status()).toBe(200);
  const responseBody = await response.json();
  expect(responseBody).toHaveProperty('token');
  expect(responseBody.token).toBe('QpwL5tke4Pnpja7X4');
});

test('POST Login Unsuccesfully - Validate API Response', async ({ request }) => {
  const requestBody = {
    email: 'peter@klaven'
  };
  const response = await request.post('https://reqres.in/api/login', {
    data: requestBody
  });
  expect(response.status()).toBe(400);
  const responseBody = await response.json();
  expect(responseBody).toHaveProperty('error');
  expect(responseBody.error).toBe('Missing password');
});

test('PUT Update - Validate API Response', async ({ request }) => {
  const requestBody = {
    name: 'morpheus',
    job: 'zion resident'
  };
  const response = await request.put('https://reqres.in/api/users/2', {
    data: requestBody
  });
  expect(response.status()).toBe(200);
  const responseBody = await response.json();
  expect(responseBody).toHaveProperty('name', 'morpheus');
  expect(responseBody).toHaveProperty('job', 'zion resident');
  expect(responseBody).toHaveProperty('updatedAt');
});

test('PATCH Update - Validate API Response', async ({ request }) => {
  const requestBody = {
    name: 'morpheus',
    job: 'zion resident'
  };
  const response = await request.patch('https://reqres.in/api/users/2', {
    data: requestBody
  });
  expect(response.status()).toBe(200);
  const responseBody = await response.json();
  expect(responseBody).toHaveProperty('name', 'morpheus');
  expect(responseBody).toHaveProperty('job', 'zion resident');
  expect(responseBody).toHaveProperty('updatedAt');
});

test('DELETE - Validate API Response', async ({ request }) => {
  const apiUrl = 'https://reqres.in/api/users/2';
  const response = await request.delete(apiUrl);
  expect(response.status()).toBe(204);
  const responseBody = await response.text();
  expect(responseBody).toBe('');
});
