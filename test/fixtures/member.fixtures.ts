import { Member, MemberStatus } from '@coop/shared';

export function createMemberFixture(overrides?: Partial<Member>): Member {
  const timestamp = Date.now();
  return {
    id: `member-${timestamp}`,
    firstName: 'John',
    lastName: 'Doe',
    email: `john.doe${timestamp}@example.com`,
    phoneNumber: '1234567890',
    membershipNumber: `MEM${timestamp}`,
    joinDate: new Date(),
    status: MemberStatus.ACTIVE,
    ...overrides,
  };
}

export function createMemberListFixture(count: number): Member[] {
  return Array.from({ length: count }, (_, index) =>
    createMemberFixture({
      firstName: `Member${index}`,
      email: `member${index}@example.com`,
      membershipNumber: `MEM${String(index + 1).padStart(3, '0')}`,
    })
  );
}

export const memberFixtures = {
  activeMember: createMemberFixture(),
  suspendedMember: createMemberFixture({
    status: MemberStatus.SUSPENDED,
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
  }),
  inactiveMember: createMemberFixture({
    status: MemberStatus.INACTIVE,
    firstName: 'Bob',
    lastName: 'Johnson',
    email: 'bob.johnson@example.com',
  }),
};
