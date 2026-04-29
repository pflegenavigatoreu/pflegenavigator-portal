// Workflow für Freigabe-Prozess: Draft → Review → Published

export type ContentStatus = 'draft' | 'review' | 'rejected' | 'published' | 'archived';

export interface ApprovalWorkflow {
  id: string;
  contentType: 'flyer' | 'social' | 'press' | 'seo' | 'crowdfunding';
  contentId: string;
  status: ContentStatus;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  reviewedBy?: string;
  reviewComments?: string;
  publishedAt?: Date;
  version: number;
}

export interface ContentVersion {
  id: string;
  contentId: string;
  version: number;
  data: Record<string, unknown>;
  createdAt: Date;
  createdBy: string;
  changeLog: string;
}

// Workflow-Transitions
export const WORKFLOW_TRANSITIONS: Record<ContentStatus, ContentStatus[]> = {
  draft: ['review', 'archived'],
  review: ['published', 'rejected', 'draft'],
  rejected: ['draft', 'archived'],
  published: ['archived'],
  archived: ['draft'],
};

export function canTransition(from: ContentStatus, to: ContentStatus): boolean {
  return WORKFLOW_TRANSITIONS[from]?.includes(to) ?? false;
}

export function getNextStatuses(current: ContentStatus): ContentStatus[] {
  return WORKFLOW_TRANSITIONS[current] ?? [];
}

export function createApprovalWorkflow(
  contentType: ApprovalWorkflow['contentType'],
  contentId: string,
  createdBy: string
): ApprovalWorkflow {
  return {
    id: `workflow-${Date.now()}`,
    contentType,
    contentId,
    status: 'draft',
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy,
    version: 1,
  };
}

export function transitionWorkflow(
  workflow: ApprovalWorkflow,
  newStatus: ContentStatus,
  user: string,
  comments?: string
): ApprovalWorkflow {
  if (!canTransition(workflow.status, newStatus)) {
    throw new Error(`Invalid transition from ${workflow.status} to ${newStatus}`);
  }

  const updated: ApprovalWorkflow = {
    ...workflow,
    status: newStatus,
    updatedAt: new Date(),
  };

  if (newStatus === 'published') {
    updated.publishedAt = new Date();
  }

  if (newStatus === 'review' || newStatus === 'rejected' || newStatus === 'published') {
    updated.reviewedBy = user;
    updated.reviewComments = comments;
  }

  return updated;
}

// Validierungs-Regeln für verschiedene Content-Typen
export const VALIDATION_RULES: Record<string, string[]> = {
  flyer: ['title', 'format', 'content'],
  social: ['platform', 'content', 'hashtags'],
  press: ['title', 'content', 'date'],
  seo: ['title', 'metaDescription', 'content', 'keywords'],
  crowdfunding: ['title', 'description', 'goal'],
};

export function validateContent(
  contentType: keyof typeof VALIDATION_RULES,
  data: Record<string, unknown>
): { valid: boolean; missing: string[] } {
  const required = VALIDATION_RULES[contentType] ?? [];
  const missing = required.filter((field) => !data[field] || (data[field] as string).trim?.() === '');
  
  return {
    valid: missing.length === 0,
    missing,
  };
}
