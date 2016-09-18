'use strict';

let crypto = require('crypto'),
   algorithm = 'aes256', // or any other algorithm supported by OpenSSL
   key = 'ZVJ4^F4EUp#?N7JJFm-9StPd28JpJnDwjcRnbNuQHkAVVfPv_mUt%XjfJbY7NFgtJ94!=X-YQa=u7J^u=HH$ew33pJTy6Bfefx+TnD6fGE-YQ5&#93VVb&X-wfvrnT2*Jz*Nq!KTMjvwQ@+&HxajwgwC4A37aRG!!NFvVCL&&um^9qSmuT*Eb3%WTGNthkvYZzm@F8kwS^4h&48xvA5Yb@qMPRsGL6=*4kPnNXsf&Huas#%M^M^2+YLmZ=*RFg*c';

exports.hashLogin = function(text) {
  let cipher = crypto.createCipher(algorithm, key);  
  return cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
}

exports.unhashLogin = function(hash) {
  let decipher = crypto.createDecipher(algorithm, key);
  return decipher.update(hash, 'hex', 'utf8') + decipher.final('utf8');
}