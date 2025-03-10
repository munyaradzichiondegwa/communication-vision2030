// models/Policy.js
const policySchema = new mongoose.Schema({
  name: { type: String, required: true },
  version: { type: Number, default: 1 },
  content: { type: mongoose.Schema.Types.Mixed, required: true },
  effectiveFrom: Date,
  hash: { type: String, required: true },
  previousVersion: { type: mongoose.Schema.Types.ObjectId, ref: 'Policy' },
  isActive: { type: Boolean, default: false }
});

// Policy Manager Service
class PolicyManager {
  async createNewVersion(policyData) {
    const current = await this.findActivePolicy(policyData.name);
    const newPolicy = new Policy({
      ...policyData,
      version: current ? current.version + 1 : 1,
      previousVersion: current?._id,
      hash: this.generateHash(policyData.content)
    });
    
    await newPolicy.validate();
    return newPolicy.save();
  }

  async rollbackVersion(policyName, targetVersion) {
    const target = await Policy.findOne({ name: policyName, version: targetVersion });
    return this.createNewVersion({
      name: policyName,
      content: target.content,
      effectiveFrom: Date.now()
    });
  }
  
  generateHash(content) {
    return crypto.createHash('sha256')
      .update(JSON.stringify(content))
      .digest('hex');
  }
}

// Git Integration Hook
git.on('commit', async (commit) => {
  if(commit.includes('policies/')) {
    await PolicyService.syncWithRepo();
    await PolicyValidator.validateAll();
  }
});