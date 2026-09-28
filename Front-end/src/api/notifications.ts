export interface NotificationResult {
  delivered: boolean;
  recipientCount: number;
}

export async function notifyRdsAboutPlan(
  formationCount: number,
): Promise<NotificationResult> {
  return {
    delivered: true,
    recipientCount: formationCount > 0 ? 1 : 0,
  };
}

export async function emailEmployee(
  employeeId: string,
  formationId: string,
): Promise<NotificationResult> {
  return {
    delivered: Boolean(employeeId && formationId),
    recipientCount: 1,
  };
}
