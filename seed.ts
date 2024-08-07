


  // Load environment variables
require('dotenv').config();

const mongoose = require('mongoose');

// Connect to MongoDB using the connection string from the .env file
mongoose.connect('mongodb+srv://app:ooxiPwFwe92LrPZ3@wslahcluster0.5jszwf3.mongodb.net/WSLAH_DB?retryWrites=true&w=majority')
  .then(() => {
    console.log('Connected to MongoDB');
    createExampleEntries();
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Company Schema
const companySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  region: { type: String },
  logo: { type: String },
  address: { type: String },
  phoneNumber: { type: String },
  email: { type: String },
  updatedAt: { type: Date, default: Date.now },
});

// Entity Schema
const entitySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  name: { type: String, required: true },
  lat: { type: Number },
  lng: { type: Number },
  description: { type: String },
  updatedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

// Unit Schema
const unitSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  entityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Entity', required: true },
  unitName: { type: String, required: true },
  unitType: { type: String },
  isPublic: { type: Boolean },
  updatedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

// Device Schema
const deviceSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  unitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit', required: true },
  deviceType: { type: String, required: true },
  brand: { type: String },
  isPublic: { type: Boolean },
  isConnectedToNetwork: { type: Boolean },
  status: { type: String },
  lastMaintenanceDate: { type: Date },
});

// Media Schema
const mediaSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  unitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit', required: true },
  mediaType: { type: String, required: true },
  url: { type: String },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// Roles Schema
const rolesSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  updatedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

// Actions Schema
const actionsSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  updatedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

// Reservation Schema
const reservationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  entityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Entity', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  lockId: { type: String, required: true },
  date: { type: Date },
  hours: { type: [Number] }, // Array of numbers
});

// Marketplace Schema
const marketplaceSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  unitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit', required: true },
  availableFrom: { type: Date },
  price: { type: Number },
  description: { type: String },
  rating: { type: Number },
  updatedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

// Users Schema
const usersSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

// Subscription Schema
const subscriptionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  deviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Device', required: true },
  type: { type: String, required: true },
  balance: { type: Number },
  startSubscription: { type: Date },
  endSubscription: { type: Date },
  status: { type: String },
  updatedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

// SubscriptionItems Schema
const subscriptionItemsSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  subscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription', required: true },
  price: { type: Number },
  discountPercent: { type: Number },
  devicePriceId: { type: mongoose.Schema.Types.ObjectId, ref: 'DevicePrice', required: true },
  itemType: { type: String },
  updatedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

// DevicePrice Schema
const devicePriceSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number },
  itemType: { type: String },
  updatedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

// Creating Models
const CompanyModel = mongoose.model('Company', companySchema);
const EntityModel = mongoose.model('Entity', entitySchema);
const UnitModel = mongoose.model('Unit', unitSchema);
const DeviceModel = mongoose.model('Device', deviceSchema);
const MediaModel = mongoose.model('Media', mediaSchema);
const RolesModel = mongoose.model('Roles', rolesSchema);
const ActionsModel = mongoose.model('Actions', actionsSchema);
const ReservationModel = mongoose.model('Reservation', reservationSchema);
const MarketplaceModel = mongoose.model('Marketplace', marketplaceSchema);
const UsersModel = mongoose.model('Users', usersSchema);
const SubscriptionModel = mongoose.model('Subscription', subscriptionSchema);
const SubscriptionItemsModel = mongoose.model('SubscriptionItems', subscriptionItemsSchema);
const DevicePriceModel = mongoose.model('DevicePrice', devicePriceSchema);

// Function to create example entries for each collection
async function createExampleEntries() {
  try {
    // Company Example
    const company = new CompanyModel({
      id: '1',
      name: 'Example Company',
      region: 'North America',
      logo: 'example_logo.png',
      address: '123 Example St',
      phoneNumber: '123-456-7890',
      email: 'info@example.com',
    });
    await company.save();
    console.log('Company created:', company);

    // Entity Example
    const entity = new EntityModel({
      id: '1',
      companyId: company._id, // Use the _id of the company created
      name: 'Main Office',
      lat: 37.7749,
      lng: -122.4194,
      description: 'Main office located in San Francisco.',
    });
    await entity.save();
    console.log('Entity created:', entity);

    // Unit Example
    const unit = new UnitModel({
      id: '1',
      entityId: entity._id, // Use the _id of the entity created
      unitName: 'Conference Room A',
      unitType: 'Meeting Room',
      isPublic: true,
    });
    await unit.save();
    console.log('Unit created:', unit);

    // Device Example
    const device = new DeviceModel({
      id: '1',
      unitId: unit._id, // Use the _id of the unit created
      deviceType: 'Projector',
      brand: 'Epson',
      isPublic: true,
      isConnectedToNetwork: true,
      status: 'Available',
      lastMaintenanceDate: new Date('2023-01-15'),
    });
    await device.save();
    console.log('Device created:', device);

    // Media Example
    const media = new MediaModel({
      id: '1',
      unitId: unit._id, // Use the _id of the unit created
      mediaType: 'Image',
      url: 'https://example.com/image.png',
      description: 'Image of the conference room.',
    });
    await media.save();
    console.log('Media created:', media);

    // Roles Example
    const role = new RolesModel({
      id: '1',
      name: 'Administrator',
      description: 'Full access to all resources.',
    });
    await role.save();
    console.log('Role created:', role);

    // Actions Example
    const action = new ActionsModel({
      id: '1',
      name: 'Create',
      description: 'Allows creation of resources.',
    });
    await action.save();
    console.log('Action created:', action);

    // Users Example
    const user = new UsersModel({
      id: '1',
      companyId: company._id, // Use the _id of the company created
      username: 'john_doe',
      password: 'securepassword',
    });
    await user.save();
    console.log('User created:', user);

    // Reservation Example
    const reservation = new ReservationModel({
      id: '1',
      entityId: entity._id, // Use the _id of the entity created
      userId: user._id, // Use the _id of the user created
      lockId: 'lock_123',
      date: new Date('2023-08-01'),
      hours: [9, 10, 11],
    });
    await reservation.save();
    console.log('Reservation created:', reservation);

    // Marketplace Example
    const marketplace = new MarketplaceModel({
      id: '1',
      unitId: unit._id, // Use the _id of the unit created
      availableFrom: new Date('2023-08-01'),
      price: 150.0,
      description: 'Available for conferences and meetings.',
      rating: 4.5,
    });
    await marketplace.save();
    console.log('Marketplace item created:', marketplace);

    // Subscription Example
    const subscription = new SubscriptionModel({
      id: '1',
      companyId: device._id, // Use the _id of the company created
      type: 'Integraion',
      balance: 2000,
      startSubscription: new Date('2023-01-01'),
      endSubscription: new Date('2024-01-01'),
      status: 'Active',
    });
    await subscription.save();
    console.log('Subscription created:', subscription);

    // DevicePrice Example
    const devicePrice = new DevicePriceModel({
      id: '1',
      name: 'Basic Plan',
      price: 29.99,
      itemType: 'Monthly',
    });
    await devicePrice.save();
    console.log('DevicePrice created:', devicePrice);

    // SubscriptionItems Example
    const subscriptionItem = new SubscriptionItemsModel({
      id: '1',
      subscriptionId: subscription._id, // Use the _id of the subscription created
      price: 100,
      discountPercent: 10,
      devicePriceId: devicePrice._id, // Use the _id of the devicePrice created
      itemType: 'Add-on',
    });
    await subscriptionItem.save();
    console.log('SubscriptionItem created:', subscriptionItem);

  } catch (error) {
    console.error('Error creating example entries:', error);
  }
}
