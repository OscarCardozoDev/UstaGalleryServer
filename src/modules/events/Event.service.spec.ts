import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { EventService } from './Event.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PhotosService } from 'src/modules/photos/Photos.service';

const APPROVED_PAST_EVENT = {
  uid: 'event-1',
  status: 'APPROVED',
  startDate: new Date('2026-04-01T18:00:00'), // past
  name: 'Test event',
  description: 'desc',
  eventType: 'EXHIBITION',
  endDate: null,
  isActive: true,
  isVirtual: false,
  locationUrl: null,
  streamingUrl: null,
  feedback: null,
  createdById: 'user-1',
  groups: [],
  products: [],
  photos: [],
  invitations: [],
  createdBy: { uid: 'user-1', name: 'Oscar', lastName: 'C' },
};

const APPROVED_FUTURE_EVENT = {
  ...APPROVED_PAST_EVENT,
  uid: 'event-2',
  startDate: new Date('2099-01-01T18:00:00'), // far future
};

const mockPrisma = {
  events: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  groupEvent: { createMany: jest.fn() },
  eventProduct: { createMany: jest.fn() },
  eventPhoto: { create: jest.fn() },
  products: { findMany: jest.fn() },
  eventInvitation: { findUnique: jest.fn(), findMany: jest.fn() },
  $transaction: jest.fn(),
};

const mockPhotosService = {
  createPhotoUseCase: jest.fn(),
  deletePhotoUseCase: jest.fn(),
};

describe('EventService - lazyComplete', () => {
  let service: EventService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EventService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: PhotosService, useValue: mockPhotosService },
      ],
    }).compile();

    service = module.get(EventService);
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('marks APPROVED event as COMPLETED when startDate is in the past', async () => {
    mockPrisma.events.findUnique.mockResolvedValue(APPROVED_PAST_EVENT);
    mockPrisma.events.update.mockResolvedValue({
      ...APPROVED_PAST_EVENT,
      status: 'COMPLETED',
    });

    const result = await service.getById('event-1');

    expect(mockPrisma.events.update).toHaveBeenCalledWith({
      where: { uid: 'event-1' },
      data: { status: 'COMPLETED' },
    });
    expect(result.status).toBe('COMPLETED');
  });

  it('does not update APPROVED event when startDate is in the future', async () => {
    mockPrisma.events.findUnique.mockResolvedValue(APPROVED_FUTURE_EVENT);

    const result = await service.getById('event-2');

    expect(mockPrisma.events.update).not.toHaveBeenCalled();
    expect(result.status).toBe('APPROVED');
  });

  it('does not update PENDING event regardless of date', async () => {
    const pendingPastEvent = {
      ...APPROVED_PAST_EVENT,
      uid: 'event-3',
      status: 'PENDING',
    };
    mockPrisma.events.findUnique.mockResolvedValue(pendingPastEvent);

    const result = await service.getById('event-3');

    expect(mockPrisma.events.update).not.toHaveBeenCalled();
    expect(result.status).toBe('PENDING');
  });

  it('does not update CANCELLED event regardless of date', async () => {
    const cancelledPastEvent = {
      ...APPROVED_PAST_EVENT,
      uid: 'event-4',
      status: 'CANCELLED',
    };
    mockPrisma.events.findUnique.mockResolvedValue(cancelledPastEvent);

    const result = await service.getById('event-4');

    expect(mockPrisma.events.update).not.toHaveBeenCalled();
    expect(result.status).toBe('CANCELLED');
  });

  it('throws NotFoundException when event does not exist', async () => {
    mockPrisma.events.findUnique.mockResolvedValue(null);

    await expect(service.getById('nonexistent')).rejects.toThrow(NotFoundException);
  });
});
