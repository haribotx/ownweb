import type { Schema, Struct } from '@strapi/strapi';

export interface SharedSections extends Struct.ComponentSchema {
  collectionName: 'components_shared_sections';
  info: {
    displayName: 'Sections';
  };
  attributes: {
    Contents: Schema.Attribute.Blocks;
    Title: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'shared.sections': SharedSections;
    }
  }
}
