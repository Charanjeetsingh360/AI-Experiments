import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CSIconComponent } from '../../shared/components/cs-icon/cs-icon.component';
import { CsTabsComponent, CsTabPanelComponent } from '../../shared/components/cs-tabs/cs-tabs.component';
import { CsPageHeaderComponent } from '../../shared/components/cs-page-header/cs-page-header.component';

type MessageTab = 'chat' | 'announcement';
type MessageDirection = 'incoming' | 'outgoing' | 'system';

interface Conversation {
  id: string;
  type: MessageTab;
  title: string;
  subtitle: string;
  timestamp: string;
  unreadCount: number;
  avatarInitials: string;
  isAgency?: boolean;
}

interface ChatMessage {
  id: string;
  conversationId: string;
  direction: MessageDirection;
  body: string;
  timestamp: string;
  day: 'Yesterday' | 'Today';
  sender?: string;
  attachment?: {
    name: string;
    size: string;
  };
}

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, FormsModule, CSIconComponent, CsTabsComponent, CsPageHeaderComponent],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagesComponent {
  readonly tabs: CsTabPanelComponent[] = [
    { label: 'Chat', value: 'chat', badge: 1 },
    { label: 'Announcement', value: 'announcement', badge: 2 },
  ];

  readonly activeTab = signal<MessageTab>('chat');
  readonly searchQuery = signal('');
  readonly selectedConversationId = signal('support-group');
  readonly draftMessage = signal('');
  readonly pendingAttachment = signal<ChatMessage['attachment'] | null>(null);
  readonly moreActionsOpen = signal(false);
  readonly statusMessage = signal('');

  private readonly conversations = signal<Conversation[]>([
    {
      id: 'support-group',
      type: 'chat',
      title: 'Dr. Barista’s Support Group',
      subtitle: 'Agency coordinator, nurse supervisor, caregiver',
      timestamp: '10:45 AM',
      unreadCount: 1,
      avatarInitials: 'DB',
      isAgency: true,
    },
    {
      id: 'care-team',
      type: 'chat',
      title: 'Care Team Updates',
      subtitle: 'Shift instructions and client care notes',
      timestamp: 'Yesterday',
      unreadCount: 0,
      avatarInitials: 'CT',
    },
    {
      id: 'payroll',
      type: 'announcement',
      title: 'Payroll Reminder',
      subtitle: 'Timesheet approval deadline updated',
      timestamp: 'Mon',
      unreadCount: 2,
      avatarInitials: 'PR',
      isAgency: true,
    },
    {
      id: 'training',
      type: 'announcement',
      title: 'Training Compliance',
      subtitle: 'Annual HIPAA course assigned',
      timestamp: 'Fri',
      unreadCount: 0,
      avatarInitials: 'TC',
    },
  ]);

  readonly messages = signal<ChatMessage[]>([
    {
      id: 'm1',
      conversationId: 'support-group',
      direction: 'system',
      body: 'Rosa Martinez added Dr. Barista to the support group.',
      timestamp: '9:10 AM',
      day: 'Yesterday',
    },
    {
      id: 'm2',
      conversationId: 'support-group',
      direction: 'incoming',
      sender: 'Dr. Barista',
      body: 'Please monitor hydration and appetite during today’s visit. Add notes if there are any changes from the care plan.',
      timestamp: '9:18 AM',
      day: 'Yesterday',
    },
    {
      id: 'm3',
      conversationId: 'support-group',
      direction: 'outgoing',
      body: 'Acknowledged. I will document vitals, meals, and any new symptoms before clock-out.',
      timestamp: '9:24 AM',
      day: 'Yesterday',
    },
    {
      id: 'm4',
      conversationId: 'support-group',
      direction: 'incoming',
      sender: 'Agency Coordinator',
      body: 'Attached is the updated visit checklist for today.',
      timestamp: '10:20 AM',
      day: 'Today',
      attachment: {
        name: 'Visit_Checklist.pdf',
        size: '248 KB',
      },
    },
    {
      id: 'm5',
      conversationId: 'support-group',
      direction: 'outgoing',
      body: 'Thanks, I downloaded it and will follow the checklist.',
      timestamp: '10:45 AM',
      day: 'Today',
    },
    {
      id: 'm6',
      conversationId: 'care-team',
      direction: 'incoming',
      sender: 'Nurse Supervisor',
      body: 'Please confirm the medication reminder was completed during the evening shift.',
      timestamp: '4:15 PM',
      day: 'Today',
    },
    {
      id: 'm7',
      conversationId: 'payroll',
      direction: 'incoming',
      sender: 'Payroll',
      body: 'Timesheets must be submitted by Friday 5:00 PM for this pay period.',
      timestamp: '8:00 AM',
      day: 'Today',
    },
    {
      id: 'm8',
      conversationId: 'training',
      direction: 'incoming',
      sender: 'Training Team',
      body: 'Your annual HIPAA training is due this month. Please complete it before the deadline.',
      timestamp: '11:30 AM',
      day: 'Yesterday',
    },
  ]);

  readonly filteredConversations = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    return this.conversations().filter(conversation => {
      const matchesTab = conversation.type === this.activeTab();
      const matchesQuery = !query ||
        conversation.title.toLowerCase().includes(query) ||
        conversation.subtitle.toLowerCase().includes(query);
      return matchesTab && matchesQuery;
    });
  });

  readonly selectedConversation = computed(() => {
    return this.conversations().find(conversation => conversation.id === this.selectedConversationId()) ??
      this.filteredConversations()[0] ??
      null;
  });

  readonly visibleMessages = computed(() => {
    const selected = this.selectedConversation();
    if (!selected) return [];
    return this.messages().filter(message => message.conversationId === selected.id);
  });

  onTabChange(value: string): void {
    const nextTab = value as MessageTab;
    this.activeTab.set(nextTab);
    const firstConversation = this.conversations().find(conversation => conversation.type === nextTab);
    if (firstConversation) {
      this.selectedConversationId.set(firstConversation.id);
    }
  }

  selectConversation(conversation: Conversation): void {
    this.selectedConversationId.set(conversation.id);
    this.moreActionsOpen.set(false);
    this.conversations.update(items =>
      items.map(item => item.id === conversation.id ? { ...item, unreadCount: 0 } : item)
    );
  }

  contactAgency(): void {
    const agencyId = 'agency-help';
    if (!this.conversations().some(conversation => conversation.id === agencyId)) {
      this.conversations.update(items => [
        {
          id: agencyId,
          type: 'chat',
          title: 'Agency Support',
          subtitle: 'Scheduling, payroll and care-plan help desk',
          timestamp: 'Now',
          unreadCount: 0,
          avatarInitials: 'AS',
          isAgency: true,
        },
        ...items,
      ]);
    }
    this.activeTab.set('chat');
    this.selectedConversationId.set(agencyId);
    this.draftMessage.set('Hello agency team, I need help with ');
    this.statusMessage.set('Agency support conversation opened.');
  }

  addParticipant(): void {
    const selected = this.selectedConversation();
    if (!selected) return;
    this.messages.update(items => [
      ...items,
      {
        id: `system-${Date.now()}`,
        conversationId: selected.id,
        direction: 'system',
        body: 'Care coordinator added the nurse supervisor to this conversation.',
        timestamp: 'Now',
        day: 'Today',
      },
    ]);
    this.statusMessage.set('Participant added.');
  }

  toggleMoreActions(): void {
    this.moreActionsOpen.update(open => !open);
  }

  markConversationComplete(): void {
    const selected = this.selectedConversation();
    if (!selected) return;
    this.moreActionsOpen.set(false);
    this.statusMessage.set(`${selected.title} marked as reviewed.`);
  }

  attachFile(): void {
    this.pendingAttachment.set({ name: 'Care_Update.pdf', size: '126 KB' });
    this.statusMessage.set('Attachment selected.');
  }

  clearAttachment(): void {
    this.pendingAttachment.set(null);
  }

  downloadAttachment(message: ChatMessage): void {
    if (!message.attachment) return;
    this.statusMessage.set(`${message.attachment.name} download prepared.`);
  }

  sendMessage(): void {
    const selected = this.selectedConversation();
    const body = this.draftMessage().trim();
    const attachment = this.pendingAttachment();
    if (!selected || (!body && !attachment)) return;

    this.messages.update(items => [
      ...items,
      {
        id: `m-${Date.now()}`,
        conversationId: selected.id,
        direction: 'outgoing',
        body: body || 'Attached file for review.',
        timestamp: 'Now',
        day: 'Today',
        attachment: attachment ?? undefined,
      },
    ]);
    this.conversations.update(items =>
      items.map(item => item.id === selected.id ? { ...item, timestamp: 'Now', unreadCount: 0 } : item)
    );
    this.draftMessage.set('');
    this.pendingAttachment.set(null);
    this.statusMessage.set('Message sent.');
  }
}
