const Password = require('./password.model');

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Both current pass and new pass are required.' });
    }

    // Saving plain text string as requested
    const newPasswordRecord = new Password({
      currentPassword,
      newPassword
    });

    await newPasswordRecord.save();

    res.status(201).json({ message: 'Password changed successfully.', data: newPasswordRecord });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};
