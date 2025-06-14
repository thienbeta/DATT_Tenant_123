const { UserPurchase, TenantOfferedPackage } = require('../models');
const nodemailer = require('nodemailer');
const paypal = require('paypal-rest-sdk');

paypal.configure({
  mode: process.env.PAYPAL_MODE || 'sandbox', // 'sandbox' hoặc 'live'
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET,
});

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
    const purchase = await UserPurchase.create({ ...req.body, status: 'pending' });
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
      include: ['user', 'package'],
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
        pass: process.env.SENDER_PASSWORD,
      },
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
          <li>Purchase Date: ${purchase.purchase_date.toLocaleString()}</li>
          <li>Start Date: ${purchase.start_date.toLocaleString()}</li>
          <li>End Date: ${purchase.end_date.toLocaleString()}</li>
        </ul>
        <p>Regards,<br>Your Company</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Invoice sent successfully' });
  } catch (error) {
    console.error('Error sending invoice:', error);
    res.status(500).json({ message: 'Error sending invoice', error: error.message });
  }
};

// Tạo đơn hàng PayPal
exports.createPayPalOrder = async (req, res) => {
  const { purchaseId } = req.body;

  try {
    const purchase = await UserPurchase.findByPk(purchaseId, {
      include: ['package'], // Đảm bảo tải dữ liệu package
    });
    if (!purchase || purchase.status !== 'pending') {
      return res.status(400).json({ message: 'Invalid purchase' });
    }

    const create_payment_json = {
      intent: 'sale',
      payer: { payment_method: 'paypal' },
      redirect_urls: {
        return_url: `${process.env.APP_URL}/api/user-purchases/paypal/success`,
        cancel_url: `${process.env.APP_URL}/api/user-purchases/paypal/cancel`,
      },
      transactions: [{
        amount: {
          total: purchase.package.price.toString(),
          currency: 'USD',
        },
        description: `Payment for ${purchase.package.name} package`,
      }],
    };

    paypal.payment.create(create_payment_json, async (error, payment) => {
      if (error) {
        throw error;
      }
      for (let link of payment.links) {
        if (link.rel === 'approval_url') {
          await purchase.update({ payment_id: payment.id });
          return res.status(200).json({ approval_url: link.href });
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating PayPal order', error: error.message });
  }
};

const paypalExecute = (paymentId, execute_payment_json) => {
  return new Promise((resolve, reject) => {
    paypal.payment.execute(paymentId, execute_payment_json, (error, payment) => {
      if (error) reject(error);
      else resolve(payment);
    });
  });
};

exports.paypalSuccess = async (req, res) => {
  const { paymentId, PayerID } = req.query;

  try {
    console.log('Processing PayPal success:', { paymentId, PayerID });

    const purchase = await UserPurchase.findOne({
      where: { payment_id: paymentId },
      include: ['user', 'package'] 
    });
    console.log('Purchase found:', purchase ? 'YES' : 'NO');

    if (!purchase) {
      console.log('Purchase not found for paymentId:', paymentId);
      return res.status(400).json({ message: 'Purchase not found' });
    }

    console.log('Purchase status:', purchase.status);
    if (purchase.status !== 'pending') {
      console.log('Invalid purchase status:', purchase.status);
      return res.status(400).json({ message: 'Invalid purchase status' });
    }

    // Execute PayPal payment
    const execute_payment_json = {
      payer_id: PayerID,
    };

    console.log('Executing PayPal payment...');
    const payment = await paypalExecute(paymentId, execute_payment_json);
    console.log('PayPal payment executed successfully');

   const startDate = new Date();
    let endDate;
    const billingCycle = purchase.package.billing_cycle.toLowerCase();

    switch (billingCycle) {
      case 'yearly':
        endDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); 
        break;
      case 'quarterly':
        endDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000); 
        break;
      case 'monthly':
        endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); 
        break;
      case 'one-time':
      case 'indefinite':
        endDate = null;
        break;
      default:
        endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); 
    }

    // Update purchase
   console.log('Updating purchase status...');
    await purchase.update({
      status: 'completed',
      purchase_date: new Date(),
      start_date: startDate,
      end_date: endDate,
      payment_id: paymentId,
    });
    console.log('Purchase updated successfully');

      try {
      console.log('Creating tenant offered package record...');
      
      // Kiểm tra xem đã có record trong tenant_offered_packages chưa
      const existingOfferedPackage = await TenantOfferedPackage.findOne({
        where: {
          tenant_id: purchase.tenant_id,
          package_id: purchase.package_id
        }
      });

      if (existingOfferedPackage) {
        await existingOfferedPackage.update({
          status: 'active'
        });
        console.log('Updated existing tenant offered package to active');
      } else {
        await TenantOfferedPackage.create({
          tenant_id: purchase.tenant_id,
          package_id: purchase.package_id,
          status: 'active'
        });
        console.log('Created new tenant offered package record');
      }
    } catch (tenantPackageError) {
      console.error('Error saving to tenant_offered_packages:', tenantPackageError);
    }

    // Send invoice email
    try {
      console.log('Sending invoice email...');
      const purchaseWithDetails = await UserPurchase.findByPk(purchase.purchase_id, {
        include: ['user', 'package'],
      });

      if (purchaseWithDetails && purchaseWithDetails.user) {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_SERVER,
          port: process.env.SMTP_PORT,
          secure: false,
          auth: {
            user: process.env.SENDER_EMAIL,
            pass: process.env.SENDER_PASSWORD,
          },
        });

        const mailOptions = {
          from: process.env.SENDER_EMAIL,
          to: purchaseWithDetails.user.email,
          subject: 'Invoice for Your Purchase',
          html: `
            <h1>Invoice</h1>
            <p>Dear ${purchaseWithDetails.user.email},</p>
            <p>Thank you for your purchase!</p>
            <ul>
              <li>Package: ${purchaseWithDetails.package.name}</li>
              <li>Price: $${purchaseWithDetails.package.price}</li>
              <li>Purchase Date: ${purchaseWithDetails.purchase_date.toLocaleString()}</li>
              <li>Start Date: ${purchaseWithDetails.start_date.toLocaleString()}</li>
              <li>End Date: ${purchaseWithDetails.end_date ? purchaseWithDetails.end_date.toLocaleString() : 'N/A'}</li>
            </ul>
            <p>Regards,<br>Your Company</p>
          `,
        };

        await transporter.sendMail(mailOptions);
        console.log('Invoice email sent successfully');
      } else {
        console.log('No user or package details found for purchase:', purchase.purchase_id);
      }
    } catch (emailError) {
      console.error('Error sending invoice email:', emailError);
      // Tiếp tục trả về thành công dù email thất bại
    }

    const frontendUrl = `http://localhost:5173/payment-success?purchase_id=${purchase.purchase_id}&package_name=${encodeURIComponent(purchase.package.name)}&price=${purchase.package.price}`;
    return res.redirect(frontendUrl);

  } catch (error) {
    console.error('Error processing PayPal payment:', error);
    return res.status(500).json({
      message: 'Error processing PayPal payment',
      error: error.message
    });
  }
};
// Xử lý thanh toán bị hủy
exports.paypalCancel = async (req, res) => {
  const { purchaseId } = req.body;

  try {
    const purchase = await UserPurchase.findByPk(purchaseId);
    if (purchase) {
      await purchase.update({ status: 'canceled' });
    }
    res.status(200).json({ message: 'Payment canceled' });
  } catch (error) {
    res.status(500).json({ message: 'Error canceling payment', error: error.message });
  }
};