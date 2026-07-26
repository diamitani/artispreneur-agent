/**
 * DynamoDB single-table key builders.
 *
 * Table structure:
 *   pk (partition key) — typically USER#<userId>
 *   sk (sort key) — entity-specific prefix + id
 *
 * GSI1:
 *   gsi1pk — secondary access pattern partition
 *   gsi1sk — secondary access pattern sort
 */

export function userPk(userId: string): string {
  return `USER#${userId}`;
}

export function projectSk(projectId: string): string {
  return `PROJECT#${projectId}`;
}

export function taskSk(taskId: string): string {
  return `TASK#${taskId}`;
}

export function subtaskSk(taskId: string, subtaskId: string): string {
  return `TASK#${taskId}#SUB#${subtaskId}`;
}

export function commentSk(taskId: string, timestamp: string): string {
  return `TASK#${taskId}#CMT#${timestamp}`;
}

export function outputSk(outputId: string): string {
  return `OUTPUT#${outputId}`;
}

export function knowledgeSk(itemId: string): string {
  return `KB#${itemId}`;
}

export function skillSk(skillId: string): string {
  return `SKILL#${skillId}`;
}

export function agentSk(): string {
  return `AGENT#hermes`;
}

export function usageSk(day: string): string {
  return `USAGE#${day}`;
}
