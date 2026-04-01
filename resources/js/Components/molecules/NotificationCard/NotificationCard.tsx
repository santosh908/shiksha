import { ActionIcon, Anchor, Badge, Box, Flex, List, Title, rem, useMantineTheme, Text, Group } from '@mantine/core';
import { IconAlarmFilled, IconArchive, IconInfoSquareRounded, IconBell, IconClockHour4, IconChevronRight, IconSparkles } from '@tabler/icons-react';
import { router, usePage } from '@inertiajs/react';
import { Announcement } from '@/Components/organisms/Dashboard/SuperAdminDashboard/Announcement/Announcement.types';
import { useState } from 'react';

// Modern, professional styles with animations
const styles = `
    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes shimmer {
      0% {
        background-position: -1000px 0;
      }
      100% {
        background-position: 1000px 0;
      }
    }

    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.6;
      }
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .notification-item {
      animation: slideInUp 0.4s ease-out forwards;
      opacity: 0;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .notification-item:hover {
      transform: translateX(8px);
      background: linear-gradient(90deg, rgba(245, 248, 255, 0.5), rgba(255, 255, 255, 0));
    }

    .notification-item::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 3px;
      background: linear-gradient(180deg, var(--primary-color), var(--primary-light));
      transform: scaleY(0);
      transition: transform 0.3s ease;
    }

    .notification-item:hover::before {
      transform: scaleY(1);
    }

    .new-badge {
      animation: pulse 2s ease-in-out infinite;
    }

    .notification-icon {
      transition: all 0.3s ease;
    }

    .notification-item:hover .notification-icon {
      transform: scale(1.15) rotate(5deg);
    }

    .chevron-icon {
      transition: all 0.3s ease;
      opacity: 0;
    }

    .notification-item:hover .chevron-icon {
      opacity: 1;
      transform: translateX(4px);
    }

    .notification-title {
      position: relative;
      display: inline-block;
    }

    .notification-title::after {
      content: '';
      position: absolute;
      width: 0;
      height: 2px;
      bottom: -2px;
      left: 0;
      background: linear-gradient(90deg, var(--primary-color), var(--primary-light));
      transition: width 0.3s ease;
    }

    .notification-item:hover .notification-title::after {
      width: 100%;
    }

    .header-gradient {
      background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary-color) 100%);
      position: relative;
      overflow: hidden;
    }

    .header-gradient::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      animation: shimmer 3s infinite;
    }

    .scroll-container {
      scrollbar-width: thin;
      scrollbar-color: var(--primary-light) #f5f5f5;
    }

    .scroll-container::-webkit-scrollbar {
      width: 6px;
    }

    .scroll-container::-webkit-scrollbar-track {
      background: #f5f5f5;
      border-radius: 10px;
    }

    .scroll-container::-webkit-scrollbar-thumb {
      background: var(--primary-color);
      border-radius: 10px;
      transition: background 0.3s ease;
    }

    .scroll-container::-webkit-scrollbar-thumb:hover {
      background: var(--primary-dark);
    }

    .empty-state {
      animation: fadeIn 0.6s ease-out;
    }
  `;

interface NotificationProps {
  title: string;
  NotificationList: { url: string; text: string; date: string; isNew: boolean }[];
}

function NotificationCard({ title, NotificationList }: NotificationProps) {
  const theme = useMantineTheme();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const { AnnouncementList } = usePage<{ AnnouncementList: Announcement }>().props;

  const validAnnouncementList = Array.isArray(AnnouncementList)
    ? AnnouncementList.filter((item) => {
        const validUptoDate = new Date(item.valid_upto);
        const currentDate = new Date();
        return item.is_active === 'Y' && validUptoDate >= currentDate;
      })
    : [];

  // Function to format date in a friendly way
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Check if announcement is new (within last 3 days)
  const isNewAnnouncement = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3;
  };

  return (
    <Box
      style={{
        minWidth: 'min(400px,100%)',
        maxHeight: '420px',
        minHeight: '420px',
        background: '#ffffff',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)',
        position: 'relative',
        borderRadius: '16px',
        overflow: 'hidden',
        border: `1px solid ${theme.colors.gray[2]}`,
        '--primary-color': theme.colors.primary[6],
        '--primary-light': theme.colors.primary[3],
        '--primary-dark': theme.colors.primary[8],
      } as any}
    >
      {/* Header with gradient and animation */}
      <Box
        className="header-gradient"
        style={{
          padding: '20px 24px',
          borderBottom: `1px solid ${theme.colors.primary[4]}`,
        }}
      >
        <Flex align="center" justify="space-between">
          <Group gap="sm">
            <Box
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                padding: '8px',
                backdropFilter: 'blur(10px)',
              }}
            >
              <IconBell style={{ height: rem(24), width: rem(24), color: '#fff' }} />
            </Box>
            <Box>
              <Title order={3} style={{ color: '#fff', fontSize: '18px', fontWeight: 600, marginBottom: '2px' }}>
                {title}
              </Title>
              <Text size="xs" style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 500 }}>
                {validAnnouncementList.length} {validAnnouncementList.length === 1 ? 'announcement' : 'announcements'}
              </Text>
            </Box>
          </Group>
          <Badge
            variant="filled"
            style={{
              background: 'rgba(255, 255, 255, 0.25)',
              color: '#fff',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              fontWeight: 600,
            }}
          >
            Active
          </Badge>
        </Flex>
      </Box>

      {/* Scrollable content area */}
      <Box
        className="scroll-container"
        style={{
          overflowY: 'auto',
          maxHeight: '420px',
          padding: '4px',
        }}
      >
        {validAnnouncementList.length === 0 ? (
          <Box
            className="empty-state"
            style={{
              textAlign: 'center',
              padding: '60px 20px',
            }}
          >
            <IconSparkles
              size={48}
              style={{
                color: theme.colors.gray[4],
                marginBottom: '16px',
              }}
            />
            <Text size="md" fw={500} c="dimmed" mb="xs">
              No Announcements
            </Text>
            <Text size="sm" c="dimmed">
              You're all caught up! Check back later for updates.
            </Text>
          </Box>
        ) : (
          <Box p="md">
            {validAnnouncementList.map((item, index) => (
              <Box
                key={index}
                className="notification-item"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  position: 'relative',
                  padding: '16px',
                  marginBottom: '8px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  border: `1px solid ${theme.colors.gray[2]}`,
                  animationDelay: `${index * 0.1}s`,
                  background: hoveredIndex === index 
                    ? 'linear-gradient(90deg, rgba(245, 248, 255, 0.8), rgba(255, 255, 255, 0.4))' 
                    : '#fff',
                }}
                onClick={() => {
                  const encodedId = btoa(item.id.toString());
                  router.get(`/latest-announcement/${encodedId}`);
                }}
              >
                <Flex gap="md" align="flex-start">
                  <Box
                    className="notification-icon"
                    style={{
                      background: `linear-gradient(135deg, ${theme.colors.primary[1]}, ${theme.colors.primary[0]})`,
                      borderRadius: '10px',
                      padding: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <IconInfoSquareRounded size={20} color={theme.colors.primary[6]} />
                  </Box>

                  <Box style={{ flex: 1 }}>
                    <Flex justify="space-between" align="center" mb="xs">
                      <Text
                        className="notification-title"
                        fw={600}
                        size="sm"
                        style={{
                          color: theme.colors.gray[9],
                          marginRight: '8px',
                        }}
                      >
                        {item.title}
                      </Text>
                      
                      {isNewAnnouncement(item.created_at) && (
                        <Badge
                          className="new-badge"
                          size="xs"
                          variant="gradient"
                          gradient={{ from: theme.colors.red[5], to: theme.colors.orange[5] }}
                          style={{
                            textTransform: 'uppercase',
                            fontWeight: 700,
                            fontSize: '10px',
                          }}
                        >
                          New
                        </Badge>
                      )}
                    </Flex>

                    {/*<Group gap="xs" style={{ marginTop: '8px' }}>
                      <IconClockHour4 size={14} color={theme.colors.gray[6]} />
                      <Text size="xs" c="dimmed" fw={500}>
                        {formatDate(item.created_at)}
                      </Text>
                    </Group>*/}
                  </Box>

                  <IconChevronRight
                    className="chevron-icon"
                    size={18}
                    color={theme.colors.primary[6]}
                    style={{
                      marginTop: '4px',
                    }}
                  />
                </Flex>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* Inject CSS for animations */}
      <style>{styles}</style>
    </Box>
  );
}

export default NotificationCard;
