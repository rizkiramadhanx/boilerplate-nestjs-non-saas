const ACTION_ROLES = [
  {
    name: 'role',
    actions: ['role:create', 'role:read', 'role:update', 'role:delete'],
  },
  {
    name: 'user',
    actions: ['user:create', 'user:read', 'user:update', 'user:delete'],
  },
  {
    name: 'category',
    actions: [
      'category:create',
      'category:read',
      'category:update',
      'category:delete',
    ],
  },
  {
    name: 'event',
    actions: ['event:create', 'event:read', 'event:update', 'event:delete'],
  },
  {
    name: 'event_category',
    actions: [
      'event_category:create',
      'event_category:read',
      'event_category:update',
      'event_category:delete',
    ],
  },
  {
    name: 'registration_event',
    actions: [
      'registration_event:create',
      'registration_event:read',
      'registration_event:update',
      'registration_event:delete',
    ],
  },
];

export default ACTION_ROLES;
