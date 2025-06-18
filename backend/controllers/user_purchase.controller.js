const { UserPurchase } = require('../models'); // Thay Purchase bằng UserPurchase
  const nodemailer = require('nodemailer');

  exports.getAll = async (req, res) => {
    try {
      const purchases = await UserPurchase.findAll();
      res.status(200).json(purchases);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  exports.getById = async (req, res) => {
    try {
      const purchase = await UserPurchase.findByPk(req.params.id);
      if (!purchase) {
        return res.status(404).json({ error: 'Purchase not found' });
      }
      res.status(200).json(purchase);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  exports.create = async (req, res) => {
    try {
      const purchase = await UserPurchase.create(req.body);
      res.status(201).json(purchase);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  exports.sendInvoiceEmail = async (req, res) => {
    const { purchaseId } = req.params;

    try {
      if (!UserPurchase || typeof UserPurchase.findByPk !== 'function') {
        throw new Error('Purchase model is not properly initialized. Check models/index.js and user_purchase.model.js');
      }
      const purchase = await UserPurchase.findByPk(purchaseId, {
        include: ['user', 'package'] // Sử dụng alias 'user' và 'package'
      });

      if (!purchase) {
        return res.status(404).json({ message: 'Purchase not found' });
      }

      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_SERVER,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
          user: process.env.SENDER_EMAIL,
          pass: process.env.SENDER_PASSWORD
        }
      });

      await transporter.verify();

      const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: purchase.user.email,
        subject: 'Invoice for Your Purchase',
        html: `
          <h1>Invoice</h1>
          <p>Dear ${purchase.user.email},</p>
          <p>Thank you for your purchase!</p>
          <ul>
            <li>Package: ${purchase.package.name}</li>
            <li>Price: $${purchase.package.price}</li>
            <li>Purchase Date: ${purchase.purchase_date}</li>
            <li>Start Date: ${purchase.start_date}</li>
            <li>End Date: ${purchase.end_date}</li>
          </ul>
          <p>Regards,<br>Your Company</p>
        `
      };

      await transporter.sendMail(mailOptions);

      res.status(200).json({ message: 'Invoice sent successfully' });
    } catch (error) {
      console.error('Error sending invoice:', error);
      res.status(500).json({ message: 'Error sending invoice', error: error.message });
    }
  };