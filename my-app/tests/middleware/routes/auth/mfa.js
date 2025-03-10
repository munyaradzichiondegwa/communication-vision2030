// routes/auth/mfa.js
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

router.post('/mfa/setup', auth.required, async (req, res) => {
  const secret = speakeasy.generateSecret({
    name: `${req.user.email} (${process.env.APP_NAME})`
  });
  
  await User.findByIdAndUpdate(req.user.id, { 
    mfaSecret: secret.base32,
    mfaEnabled: false 
  });

  QRCode.toDataURL(secret.otpauth_url, (err, data_url) => {
    res.json({ 
      qrCode: data_url,
      backupCodes: generateBackupCodes(),
      manualCode: secret.base32
    });
  });
});

router.post('/mfa/verify', auth.required, async (req, res) => {
  const user = await User.findById(req.user.id);
  const verified = speakeasy.totp.verify({
    secret: user.mfaSecret,
    encoding: 'base32',
    token: req.body.token
  });

  if (verified) {
    await User.updateOne({ _id: user.id }, { mfaEnabled: true });
    res.json({ success: true });
  } else {
    res.status(400).json({ error: 'Invalid token' });
  }
});

// MFA enforcement middleware
function requireMFA(req, res, next) {
  if (req.user.mfaEnabled) return next();
  res.status(403).json({ 
    error: 'MFA required for this operation'
  });
}