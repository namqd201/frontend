export interface PostTemplateItem {
  id: string;
  userId?: string;
  name: string;
  description?: string;
  structure: string;
  exampleContent?: string;
  isDefault: boolean;
  isSystem: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PostTemplateRequest {
  name: string;
  description?: string;
  structure: string;
  exampleContent?: string;
  isDefault?: boolean;
}
