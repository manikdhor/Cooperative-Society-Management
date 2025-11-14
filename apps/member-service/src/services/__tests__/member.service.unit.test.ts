import { MemberService } from '../member.service';
import { MemberStatus } from '@coop/shared';

describe('MemberService - Unit Tests', () => {
  let service: MemberService;

  beforeEach(() => {
    service = new MemberService();
  });

  describe('createMember', () => {
    it('should create a new member with generated id', async () => {
      const memberData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phoneNumber: '1234567890',
        membershipNumber: 'MEM001',
      };

      const member = await service.createMember(memberData);

      expect(member).toHaveProperty('id');
      expect(member).toHaveProperty('joinDate');
      expect(member.status).toBe(MemberStatus.ACTIVE);
      expect(member.firstName).toBe(memberData.firstName);
      expect(member.email).toBe(memberData.email);
    });

    it('should set default status to ACTIVE', async () => {
      const member = await service.createMember({
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        phoneNumber: '9876543210',
        membershipNumber: 'MEM002',
      });

      expect(member.status).toBe(MemberStatus.ACTIVE);
    });
  });

  describe('getMemberById', () => {
    it('should return member by id', async () => {
      const created = await service.createMember({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phoneNumber: '1234567890',
        membershipNumber: 'MEM001',
      });

      const found = await service.getMemberById(created.id);

      expect(found).toEqual(created);
    });

    it('should return null for non-existent id', async () => {
      const found = await service.getMemberById('non-existent');

      expect(found).toBeNull();
    });
  });

  describe('getAllMembers', () => {
    it('should return empty array when no members', async () => {
      const members = await service.getAllMembers();

      expect(members).toEqual([]);
    });

    it('should return all members', async () => {
      await service.createMember({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phoneNumber: '1234567890',
        membershipNumber: 'MEM001',
      });
      await service.createMember({
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        phoneNumber: '9876543210',
        membershipNumber: 'MEM002',
      });

      const members = await service.getAllMembers();

      expect(members).toHaveLength(2);
    });
  });

  describe('updateMember', () => {
    it('should update existing member', async () => {
      const created = await service.createMember({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phoneNumber: '1234567890',
        membershipNumber: 'MEM001',
      });

      const updated = await service.updateMember(created.id, {
        firstName: 'Johnny',
        status: MemberStatus.SUSPENDED,
      });

      expect(updated).not.toBeNull();
      expect(updated?.firstName).toBe('Johnny');
      expect(updated?.status).toBe(MemberStatus.SUSPENDED);
      expect(updated?.id).toBe(created.id);
    });

    it('should return null for non-existent member', async () => {
      const updated = await service.updateMember('non-existent', {
        firstName: 'Test',
      });

      expect(updated).toBeNull();
    });
  });

  describe('deleteMember', () => {
    it('should delete existing member', async () => {
      const created = await service.createMember({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phoneNumber: '1234567890',
        membershipNumber: 'MEM001',
      });

      const deleted = await service.deleteMember(created.id);

      expect(deleted).toBe(true);
      const found = await service.getMemberById(created.id);
      expect(found).toBeNull();
    });

    it('should return false for non-existent member', async () => {
      const deleted = await service.deleteMember('non-existent');

      expect(deleted).toBe(false);
    });
  });

  describe('getMembersByStatus', () => {
    it('should return members filtered by status', async () => {
      const member1 = await service.createMember({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phoneNumber: '1234567890',
        membershipNumber: 'MEM001',
      });
      
      await service.createMember({
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        phoneNumber: '9876543210',
        membershipNumber: 'MEM002',
      });

      await service.updateMember(member1.id, { status: MemberStatus.SUSPENDED });

      const activeMembers = await service.getMembersByStatus(MemberStatus.ACTIVE);
      const suspendedMembers = await service.getMembersByStatus(MemberStatus.SUSPENDED);

      expect(activeMembers).toHaveLength(1);
      expect(suspendedMembers).toHaveLength(1);
    });
  });
});
