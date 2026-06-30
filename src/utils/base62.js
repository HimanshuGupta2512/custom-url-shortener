const charset = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

function generateBase62Alias(length = 6) {
  let alias = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    alias += charset[randomIndex];
  }
  return alias;
}

module.exports = { generateBase62Alias };
