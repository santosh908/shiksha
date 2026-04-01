import { router } from "@inertiajs/react";
import { Badge, Box, Container, Flex, Grid } from "@mantine/core";

interface breadcrumbProps{
    title:string;
    message:string | null; 
    link:string;
    linkTitle:string;
}

export default function DashboardBreadCrumb({title,message,link,linkTitle}:breadcrumbProps)
{
    return(
        <> 
            <Flex gap="sm" className="p-3 rounded-lg bg-slate-100" justify="space-between"  align="center"  style={{ width: '100%' }} >
                <Flex gap="sm">
                    <Box className="text-sm font-bold cursor-pointer hover:underline"  onClick={() => router.get(link)}>
                        {linkTitle}
                    </Box>
                    <Box className="text-sm">/</Box>
                    <Box className="text-sm">{title}</Box>
                </Flex>

                <Box className="text-sm" style={{ marginLeft: 'auto' }}>
                    <Badge>Login ID : {message}</Badge>
                </Box>
            </Flex>
        </>
    );
}