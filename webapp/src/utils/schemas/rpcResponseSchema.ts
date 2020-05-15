export const errorSchema = {
  type: 'object',
  properties: {
    result: {
      type: 'string',
      nullable: true,
    },
    error: {
      type: 'object',
      properties: {
        code: {
          type: 'number',
        },
        message: {
          type: 'string',
        },
      },
      required: ['message'],
    },
    id: {
      type: 'string',
    },
  },
  required: ['error'],
};

export const getBalanceSchema = {
  type: 'object',
  properties: {
    result: {
      type: 'number',
      nullable: false,
    },
    error: {
      type: 'object',
      nullable: true,
    },
    id: {
      type: 'string',
    },
  },
  required: ['result'],
};

export const blockchainInfoSchema = {
  type: 'object',
  properties: {
    result: {
      type: 'object',
      properties: {
        chain: {
          type: 'string',
        },
        blocks: {
          type: 'number',
        },
        headers: {
          type: 'number',
        },
        bestblockhash: {
          type: 'string',
        },
        difficulty: {
          type: 'number',
        },
        medianTime: {
          type: 'number',
        },
        verificationprogress: {
          type: 'number',
        },
        initialblockdownload: {
          type: 'boolean',
        },
        chainwork: {
          type: 'string',
        },
        size_on_disk: {
          type: 'number',
        },
        pruned: {
          type: 'boolean',
        },
        pruneheight: {
          type: 'number',
        },
        automatic_pruning: {
          type: 'boolean',
        },
        prune_target_size: {
          type: 'number',
        },
        softforks: {
          type: 'object',
        },
        bip9_softforks: {
          type: 'object',
        },
        warnings: {
          type: 'string',
        },
      },
      required: ['initialblockdownload'],
    },
    error: {
      nullable: true,
    },
    id: {
      type: 'string',
    },
  },
};

export const validAddressSchema = {
  type: 'object',
  properties: {
    result: {
      type: 'object',
      properties: {
        isvalid: {
          type: 'boolean',
        },
        address: {
          type: 'string',
        },
        scriptPubKey: {
          type: 'string',
        },
        isscript: {
          type: 'boolean',
        },
        iswitness: {
          type: 'boolean',
        },
        witness_version: {
          type: 'number',
        },
        witness_program: {
          type: 'string',
        },
      },
      required: ['isvalid'],
    },
    error: {
      nullable: true,
    },
    id: {
      type: 'string',
    },
  },
};

export const receiveAddressListSchema = {
  type: 'object',
  properties: {
    result: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          involvesWatchonly: { type: 'boolean' },
          address: { type: 'string' },
          account: { type: 'string' },
          amount: { type: 'number' },
          confirmations: { type: 'number' },
          label: { type: 'string' },
          txids: { type: 'array', items: { type: 'string' } },
        },
        required: ['address', 'amount'],
      },
    },
    error: {
      nullable: true,
    },
    id: {
      type: 'string',
    },
  },
};
