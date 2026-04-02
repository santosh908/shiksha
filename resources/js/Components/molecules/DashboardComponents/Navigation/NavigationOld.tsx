import { ActionIcon, Avatar, Badge, Box, Flex, Group, rgba, ScrollArea, useMantineTheme } from '@mantine/core';
import {
  IconEyeQuestion,
  IconPlus,
  IconQuestionMark,
  IconQuotes,
  IconRegistered,
  IconUser,
  IconX,
  IconArchive,
  IconUserStar,
  IconHeart,
} from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
import classes from './Navigation.module.css';
import { LinksGroup } from '@/Components/molecules/DashboardComponents/Navigation/Links/Links';
import useUserStore from '@/Store/User.store';
import { useEffect, useState } from 'react';
import { FaBullhorn, FaKey } from 'react-icons/fa';
import { IconBook } from '@tabler/icons-react';
import { IconDatabase } from '@tabler/icons-react';

type NavigationProps = {
  onClose: () => void;
};

const Navigation = ({ onClose }: NavigationProps) => {
  const tablet_match = useMediaQuery('(max-width: 768px)');
  const { name: userName, account_approved: AccountApproved, roles: RoleName, permissions: permissionName } = useUserStore();
  const theme = useMantineTheme();
  let [mockdata, setMockData] = useState<any>([]);

  useEffect(() => {
    setMockData([
      {
        title: 'Dashboard',
        ...(AccountApproved === 'N' || AccountApproved === 'R'
          ? {
              links: [
                {
                  label: 'Registration summary',
                  icon: IconRegistered,
                  link: '/Devotee/previewdata',
                },
              ],
            }
          : {}),
      },
      {
        title: 'Dashboard',
        ...(AccountApproved === 'Y' && RoleName.includes('Devotee')
          ? {
              links: [
                {
                  label: 'Profile',
                  icon: IconRegistered,
                  link: '/Devotee/Profile',
                },
                {
                  label: 'Shiksha Lavel Completed', // Corrected typo
                  icon: IconRegistered,
                  link: '/Devotee/ShikshaLavel',
                },
                {
                  label: 'Promoted Lavel', // Corrected typo
                  icon: IconRegistered,
                  link: '/Devotee/PromotedLavel',
                },
              ],
            }
          : {}),
      },
      {
        title: 'Devotee Request',
        ...(RoleName.includes('AsheryLeader')
          ? {
              links: [
                {
                  label: 'Devotee Request', //Master Data
                  icon: IconRegistered,
                  links: [
                    {
                      label: 'Registrstrion Request',
                      link: '/AsheryLeader/DevoteeRegistration',
                    },
                    {
                      label: 'Bhakti Bhekshuk Devotee List',
                      link: '/AsheryLeader/BhaktiBhikshukDevotee',
                    },
					{
					  label: 'Session Result List',
					  icon: IconUserStar,
					  link: '/AsheryLeader/sessionresultlist',
					},
					{
					  label: 'Result List',
					  icon: IconUserStar,
					  link: '/AsheryLeader/devoteeresultlist',
					},
                  ],
                },
              ],
            }
          : {}),
      },
      {
        title: 'Devotee Request',
        ...(RoleName.includes('BhaktiBhekshuk')
          ? {
              links: [
                {
                  label: 'Devotee Request', //Master Data
                  icon: IconRegistered,
                  links: [
                    {
                      label: 'Devotee Registration List',
                      link: '/BhaktiBhekshuk/BhaktiBhikshukDevotee',
                    },
					{
					  label: 'Session Result List',
					  icon: IconUserStar,
					  link: '/BhaktiBhekshuk/sessionresultlist',
					},
					{
					  label: 'Result List',
					  icon: IconUserStar,
					  link: '/BhaktiBhekshuk/devoteeresultlist',
					},
                  ],
                },
              ],
            }
          : {}),
      },
      {
        title: 'Super Admin',
        ...(RoleName.includes('SuperAdmin')
          ? {
              links: [
                {
                  label: 'Devotee', //Master Data
                  icon: IconUser,
                  links: [
                    {
                      label: 'Devotee List',
                      link: '/SuperAdmin/devoteeList',
                    },
                    {
                      label: 'Partially Devotee List',
                      link: '/SuperAdmin/partiallydevoteeList',
                    },
                    {
                      label: 'Bhakti Bhikshuk Devotee List',
                      link: '/SuperAdmin/BhaktiBhikshukDevoteeList',
                    },
                  ],
                },
                {
                  label: 'Master Data', // Master Data
                  icon: IconDatabase,
                  links: [
                    {
                      label: '📚 Book',
                      link: '/SuperAdmin/book',
                    },
                    {
                      label: '📘 Education',
                      link: '/SuperAdmin/education',
                    },
                    {
                      label: '📅 Seminar',
                      link: '/SuperAdmin/seminar',
                    },
                    {
                      label: '👨‍👩‍👧 Merital Status',
                      link: '/SuperAdmin/meritalstatus',
                    },
                    {
                      label: '👔 Profession',
                      link: '/SuperAdmin/profession',
                    },
                    {
                      label: '🙏 Prayers',
                      link: '/SuperAdmin/prayers',
                    },
                    {
                      label: '📘 Subject',
                      link: '/SuperAdmin/subject',
                    },
                    {
                      label: '📘 Shiksha Level',
                      link: '/SuperAdmin/shikshalevel',
                    },
                  ],
                  // Additional styling or properties can be added here
                  dropdownStyle: {
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    transition: '0.3s',
                  },
                },
                {
                  label: 'Ashery Leader', // Question Bank column
                  icon: IconUserStar,
                  link: '/SuperAdmin/asheryleader',
                  // links: [
                  //   {
                  //     label: '💼 Add/Edit AsheryLeader',
                  //     //link: '/SuperAdmin/question-bank/list',
                  //     link: '/SuperAdmin/asheryleader',
                  //   },
                  // ],
                },
                {
                  label: 'Bhakti Bhikshuk', // Question Bank column
                  icon: IconHeart,
                  link: '/SuperAdmin/bhaktibhikshuk',
                },
                {
                  label: 'Exam Session', // Question Bank column
                  icon: IconBook,
                  link: '/SuperAdmin/ExamSession',
                },
                {
                  label: 'Exam', // Question Bank column
                  icon: IconBook,
                  link: '/SuperAdmin/examination',
                },
                {
                  label: 'Question Bank', // Question Bank column
                  icon: IconEyeQuestion,
                  link: '/SuperAdmin/questionbank',
                },
                {
                  label: 'Announcement', // Announcemnet column
                  icon: FaBullhorn,
                  link: '/SuperAdmin/announcement',
                },
                {
                  label: 'Change Password',
                  icon: FaKey,
                  link: '/SuperAdmin/changepassword',
                },
                {
                  label: 'Shiksha App User',
                  icon: IconUserStar,
                  link: '/SuperAdmin/shikshappuser',
                },
                {
                  label: 'Result List',
                  icon: IconUserStar,
                  link: '/SuperAdmin/devoteeresultlist',
                },
                {
                  label: 'Session Result List',
                  icon: IconUserStar,
                  link: '/SuperAdmin/sessionresultlist',
                },
				 {
					label: 'Verify Exam',
					icon: FaKey,
					link: '/SuperAdmin/verifyexam',
				  },
              ],
            }
          : {}),
      },
    ]);
  }, [RoleName]);

  const links = mockdata.map((m: any, index: number) => (
    <Box pl={0} mb="md" key={`${m.title}-${index}`}>
      {m.links?.map((item: any) => {
        return (
          <LinksGroup
            key={item.label}
            {...item}
            closeSidebar={() => {
              setTimeout(() => {
                onClose();
              }, 250);
            }}
          />
        );
      })}
    </Box>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.header}>
        <a href={`/${RoleName}/dashboard`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <Flex justify="space-between" align="center" gap="sm">
            <Flex gap="md" align="center" style={{ background: rgba(theme.colors.dark[9], 0.3) }} className="w-full shadow-md rounded-lg p-3 px-5">
              <Avatar size="md" variant="white" />

              <Flex direction="column">
                <Box>{userName || ''}</Box>
                <Badge variant="filled" color="black">
                  {RoleName}
                </Badge>
              </Flex>
            </Flex>
            <Group justify="space-between" style={{ flex: tablet_match ? 'auto' : 1 }}></Group>
            {tablet_match && (
              <ActionIcon onClick={onClose} variant="transparent">
                <IconX color="white" />
              </ActionIcon>
            )}
          </Flex>
        </a>
      </div>

      <ScrollArea className={classes.links}>
        <div className={classes.linksInner}>{links}</div>
      </ScrollArea>
    </nav>
  );
};

export default Navigation;
