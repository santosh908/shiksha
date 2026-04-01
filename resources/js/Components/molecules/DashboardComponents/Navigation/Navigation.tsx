import { ActionIcon, Avatar, Badge, Box, Flex, Group, rgba, ScrollArea, useMantineTheme } from '@mantine/core';
import {
  IconEyeQuestion,
  IconRegistered,
  IconUser,
  IconX,
  IconUserStar,
  IconHeart,
  IconListCheck,
  IconCalendarStats,
  IconCheck,
  IconArrowUp,
  IconAdjustments,
  IconUsersGroup,
  IconCalendarClock,
  IconClipboardCheck,
  IconPencil,
  IconChecklist,
  IconMessageCheck,
  IconFilePlus,
  IconMessageCircle,
  IconReport,
} from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
import classes from './Navigation.module.css';
import { LinksGroup } from '@/Components/molecules/DashboardComponents/Navigation/Links/Links';
import useUserStore from '@/Store/User.store';
import { useEffect, useState } from 'react';
import { FaBullhorn, FaCheckCircle, FaKey } from 'react-icons/fa';
import { IconBook } from '@tabler/icons-react';
import { IconDatabase } from '@tabler/icons-react';
import { usePage } from '@inertiajs/react';

type NavigationProps = {
  onClose: () => void;
};

interface NavLink {
  label: string;
  icon?: any;
  link?: string;
  links?: NavLink[];
  requiredPermission?: string;
  dropdownStyle?: React.CSSProperties;
}

interface NavSection {
  title: string;
  links?: NavLink[];
}

const Navigation = ({ onClose }: NavigationProps) => {
  const tablet_match = useMediaQuery('(max-width: 768px)');
  const { name: userName, initiated_name:initiated_name,account_approved: AccountApproved, roles: RoleName, permissions: permissionName } = useUserStore();
  const theme = useMantineTheme();
  const [mockdata, setMockData] = useState<NavSection[]>([]);
  const hasPermission = (requiredPermission?: string) => {
    if (!requiredPermission) return true;
    const userPermissions = Array.isArray(permissionName) ? permissionName : [permissionName];
    if (userPermissions.includes('All Permission')) {
      return true;
    }
    // Convert to lowercase for comparison
    const normalizedPermissions = userPermissions.map((p) => (p || '').toLowerCase());
    const required = requiredPermission.toLowerCase();
    return normalizedPermissions.includes(required);
  };
  const setUserMultiValue = useUserStore((state) => state.setUserMultiValue);
  const { props } = usePage();
  useEffect(() => {
    if (props.user) {
      setUserMultiValue(props.user);
    }
  }, [props.user]);

  useEffect(() => {
    const navigationData: NavSection[] = [
      {
        title: 'Dashboard',
        ...(AccountApproved === 'N' || AccountApproved === 'R'
          ? {
              links: [
                {
                  label: 'Complete Registration',
                  icon: IconRegistered,
                  link: '/Devotee/Registration',
                },
                // {
                //   label: 'Raise Query',
                //   icon: IconMessageCircle,
                //   link: '/Devotee/message',
                // },
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
                  icon: IconUser,
                  link: '/Devotee/Registration',
                },
                {
                  label: 'Shiksha Level Completed',
                  icon: IconCheck,
                  link: '/Devotee/ShikshaLavel',
                },
                {
                  label: 'Promoted Level',
                  icon: IconArrowUp,
                  link: '/Devotee/PromotedLavel',
                },
                // {
                //   label: 'Raise Query',
                //   icon: IconMessageCircle,
                //   link: '/Devotee/message',
                // },
              ],
            }
          : {}),
      },
      {
        title: 'Action',
        links: [
          {
            label: 'Master Data',
            icon: IconDatabase,
            requiredPermission: 'Master Data',
            links: [
              { label: '📚 Book', link: '/Action/book', requiredPermission: 'Book.bookList' },
              { label: '📘 Education', link: '/Action/education', requiredPermission: 'Education.education' },
              { label: '📅 Seminar', link: '/Action/seminar', requiredPermission: 'Seminar.seminar' },
              { label: '👨‍👩‍👧 Merital Status', link: '/Action/meritalstatus', requiredPermission: 'meritalstatus.meritalstatus' },
              { label: '👔 Profession', link: '/Action/profession', requiredPermission: 'profession.profession' },
              { label: '🙏 Prayers', link: '/Action/prayers', requiredPermission: 'prayers.prayers' },
              { label: '📘 Scripture/Book', link: '/Action/subject', requiredPermission: 'subject.subject' },
              { label: '📘 Chapter/Section', link: '/Action/chapter', requiredPermission: 'Chapter.GetChapterList' },
            ],
          },
          {
            label: 'Shiksha App User',
            icon: IconUserStar,
            link: '/Action/shikshappuser',
            requiredPermission: 'shikshappuser.shikshappuser',
          },
          {
            label: 'Devotee List',
            icon: IconUser,
            link: '/Action/devoteeList',
            requiredPermission: 'devoteeList.GetSuperAdminDevoteeList',
          },
          {
            label: 'Devotee Next Level Exam',
            icon: IconUser,
            link: '/Action/devotee-module',
            requiredPermission: 'DevoteeShowNextLevel.List',
          },
          {
            label: 'Ashray Leader List',
            icon: IconUserStar,
            link: '/Action/asheryleader',
            requiredPermission: 'asheryleader.asheryleader',
          },
          {
            label: 'Bhakti Vriksha Leader List',
            icon: IconHeart,
            link: '/Action/bhaktibhikshuk',
            requiredPermission: 'bhaktibhikshuk.bhaktibhikshuk',
          },
          {
            label: 'Announcement',
            icon: FaBullhorn,
            link: '/Action/announcement',
            requiredPermission: 'announcement.announcement',
          },
          {
            label: 'Question Bank',
            icon: IconEyeQuestion,
            link: '/Action/questionbank',
            requiredPermission: 'Question.questionbank',
          },
          {
            label: 'Shiksha Level',
            icon: IconBook,
            link: '/Action/shikshalevel',
            requiredPermission: 'shikshalevel.shikshalevel',
          },
          {
            label: 'Exam Session',
            icon: IconCalendarClock,
            link: '/Action/ExamSession',
            requiredPermission: 'ExamSession.exam_session',
          },
          {
            label: 'Exam',
            icon: IconClipboardCheck,
            link: '/Action/examination',
            requiredPermission: 'examination.examination',
          },
          {
            label: 'Add Question',
            icon: IconFilePlus,
            link: '/Action/addquestion',
            requiredPermission: 'AddQuestion.addquestion',
          },
          {
            label: 'Change Password',
            icon: FaKey,
            link: '/Action/changepassword',
            requiredPermission: 'changepassword.changepassword',
          },
          {
            label: 'Verify Exam',
            icon: FaCheckCircle,
            link: '/Action/verifyexam',
            requiredPermission: 'Result.verifyexam',
          },
          {
            label: 'Allow Exam',
            icon: FaCheckCircle,
            link: '/Action/AllowExam',
            requiredPermission: 'AllowExam.AllowToExam',
          },
          {
            label: 'Update Marks',
            icon: IconPencil,
            link: '/Action/updatemarks',
            requiredPermission: 'Devotee.UpdateMarks',
          },
          {
            label: 'Result List',
            icon: IconChecklist,
            link: '/Action/devoteeresultlist',
            requiredPermission: 'Devotee.DevoteeResultList',
          },
          {
            label: 'Upload Offline Marks',
            icon: IconChecklist,
            link: '/Action/uploadofflinemarks',
            requiredPermission: 'UploadMarks.UploadOfficeMarks',
          },
          {
            label: 'Session Result List',
            icon: IconCalendarStats,
            link: '/Action/sessionresultlist',
            requiredPermission: 'Result.sessionresultlist',
          },
          {
            label: 'Report',
            icon: IconReport,
            link: '/Action/report',
            requiredPermission: 'Report.report',
          },
          {
            label: 'Start Registration',
            icon: IconFilePlus,
            link: '/Action/devotee_registration_status',
            requiredPermission: 'DevoteeRegistrationStatus.Create',
          },
        ],
      },
      {
        title: 'Devotee Request',
        ...(RoleName.includes('AsheryLeader')
          ? {
              links: [
                {
                  label: 'Devotee Result', //Master Data
                  icon: IconMessageCheck,
                  links: [
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
        title: 'Super Admin',
        ...(RoleName.includes('SuperAdmin')
          ? {
              links: [
                {
                  label: 'Raise Query',
                  icon: IconMessageCircle,
                  link: '/SuperAdmin/message',
                },
              ],
            }
          : {}),
      },
    ];

    const filteredData = navigationData
      .map((section) => ({
        ...section,
        links: section.links?.filter((link) => {
          if (link.links) {
            const filteredSubLinks = link.links.filter((subLink) => hasPermission(subLink.requiredPermission));
            link.links = filteredSubLinks;
            return filteredSubLinks.length > 0 || hasPermission(link.requiredPermission);
          }
          return hasPermission(link.requiredPermission);
        }),
      }))
      .filter((section) => section.links && section.links.length > 0);

    setMockData(filteredData);
  }, [RoleName, AccountApproved, permissionName]);

  const links = mockdata.map((m: NavSection, index: number) => (
    <Box pl={0} mb="md" key={`${m.title}-${index}`}>
      {m.links?.map((item: NavLink) => (
        //@ts-ignore
        <LinksGroup
          key={item.label}
          {...item}
          closeSidebar={() => {
            setTimeout(() => {
              onClose();
            }, 250);
          }}
        />
      ))}
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
                <Box>{RoleName[0] === "BhaktiVriksha" || RoleName[1] === "BhaktiVriksha" || RoleName[0] === "AsheryLeader" || RoleName[1] === "AsheryLeader" 
                    ? <p>{initiated_name}</p> 
                    : <p>{userName}</p>}
                  </Box>
                <Badge  color="black">
                  {RoleName[1]===undefined ? RoleName[0] :  RoleName[1] + ' Leader' }
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
