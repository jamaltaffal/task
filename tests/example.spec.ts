const { test, expect } = require('@playwright/test');

test('GET List Users - Validate API Response', async ({ request }) => {
  const response = await request.get('https://reqres.in/api/users?page=2');
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
