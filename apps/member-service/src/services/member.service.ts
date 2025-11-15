import { Member, MemberStatus, generateId } from '@coop/shared';

export class MemberService {
  private members: Map<string, Member> = new Map();

  async createMember(data: Omit<Member, 'id' | 'joinDate' | 'status'>): Promise<Member> {
    const member: Member = {
      id: generateId(),
      ...data,
      joinDate: new Date(),
      status: MemberStatus.ACTIVE,
    };
    
    this.members.set(member.id, member);
    return member;
  }

  async getMemberById(id: string): Promise<Member | null> {
    return this.members.get(id) || null;
  }

  async getAllMembers(): Promise<Member[]> {
    return Array.from(this.members.values());
  }

  async updateMember(id: string, data: Partial<Member>): Promise<Member | null> {
    const member = this.members.get(id);
    if (!member) return null;

    const updatedMember = { ...member, ...data, id };
    this.members.set(id, updatedMember);
    return updatedMember;
  }

  async deleteMember(id: string): Promise<boolean> {
    return this.members.delete(id);
  }

  async getMembersByStatus(status: MemberStatus): Promise<Member[]> {
    return Array.from(this.members.values()).filter(m => m.status === status);
  }
}
