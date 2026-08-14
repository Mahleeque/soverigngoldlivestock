const sourceUri = process.env.SOURCE_MONGO_URI || 'mongodb://localhost:27017/sovereign_gold_livestock';
const targetUri = process.env.ATLAS_MONGO_URI;

if (!targetUri) {
  throw new Error('ATLAS_MONGO_URI is required.');
}

const source = connect(sourceUri);
const targetClient = new Mongo(targetUri);
const target = targetClient.getDB(source.getName());

const batchSize = Number(process.env.MIGRATION_BATCH_SIZE || 500);
const collections = source.getCollectionInfos().filter((info) => info.type === 'collection');
const summary = {};

print(`Migrating database "${source.getName()}"`);
print(`Collections found: ${collections.map((info) => info.name).join(', ')}`);

for (const info of collections) {
  const name = info.name;
  const sourceCollection = source.getCollection(name);
  const targetCollection = target.getCollection(name);

  if (!target.getCollectionNames().includes(name)) {
    target.createCollection(name, info.options || {});
  }

  const indexes = sourceCollection.getIndexes().filter((index) => index.name !== '_id_');
  for (const index of indexes) {
    const { key, name: indexName, ns, v, ...options } = index;
    targetCollection.createIndex(key, { ...options, name: indexName });
  }

  let migrated = 0;
  let batch = [];

  sourceCollection.find().forEach((doc) => {
    batch.push({
      replaceOne: {
        filter: { _id: doc._id },
        replacement: doc,
        upsert: true
      }
    });

    if (batch.length >= batchSize) {
      targetCollection.bulkWrite(batch, { ordered: false });
      migrated += batch.length;
      batch = [];
    }
  });

  if (batch.length) {
    targetCollection.bulkWrite(batch, { ordered: false });
    migrated += batch.length;
  }

  summary[name] = {
    sourceCount: sourceCollection.countDocuments(),
    targetCount: targetCollection.countDocuments(),
    migrated
  };
}

printjson(summary);
