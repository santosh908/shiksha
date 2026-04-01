import useUserStore from "@/Store/User.store";
import { Badge, Box, Button, Card, Checkbox, Container, Grid, Group, Radio, rem, Select, Stack, Tabs, TextInput, useMatches } from "@mantine/core";
import { IconMessageCircle, IconSectionSign, IconSettings } from "@tabler/icons-react";
import { useState } from "react";

export default function CompleteRegistration()
{
  const color = useMatches({
    base: 'blue.9',
    sm: 'orange.9',
    lg: 'red.9',
  });
  
  const { name:UserName,login_id:LoginID } = useUserStore();
  const iconStyle = { width: rem(12), height: rem(12) };

 // State for tracking the active tab
 const [activeTab, setActiveTab] = useState('plInfo');

 const handleNext = () => {
  const nextTab = getNextTab(activeTab);
  if (nextTab) {
    setActiveTab(nextTab);
  }
};

// Function to handle going to the previous tab
const handleBack = () => {
  const previousTab = getPreviousTab(activeTab);
  if (previousTab) {
    setActiveTab(previousTab);
  }
};

const getNextTab = (currentTab:any) => {
  const tabOrder = ['plInfo', 'Profession', 'HeadReading', 'Seminars'];
  const currentIndex = tabOrder.indexOf(currentTab);
  return currentIndex < tabOrder.length - 1 ? tabOrder[currentIndex + 1] : null;
};

// Helper function to get the previous tab value
const getPreviousTab = (currentTab:any) => {
  const tabOrder = ['plInfo', 'Profession', 'HeadReading', 'Seminars'];
  const currentIndex = tabOrder.indexOf(currentTab);
  return currentIndex > 0 ? tabOrder[currentIndex - 1] : null;
};

    return (
        <Container fluid>
        <Stack gap="lg"  py={'20'}>
          <Grid gutter={{ base: 5, xs: 'md', md: 'xl', xl: 50 }}>
            <Grid.Col span={12}>
                <Box bg={color} c="white" p="sm">
                ! Welcome - {UserName}, Your temporary login ID is '{LoginID}'. Please complete and submit the registration form. Once your selected Ashraya Leader approves it, you will receive your permanent login ID
                </Box>
            </Grid.Col>
          </Grid>
          <Grid>
            <Grid.Col span={12}>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Group justify="space-between" mt="md" mb="xs">
                  <Badge color="pink">Fill Details</Badge>
                </Group>
                
                <Tabs value={activeTab}>
                  <Tabs.List>
                    <Tabs.Tab value="plInfo" leftSection={<IconSectionSign style={iconStyle} />}>
                      Personal Information
                    </Tabs.Tab>
                    <Tabs.Tab value="Profession" leftSection={<IconMessageCircle style={iconStyle} />}>
                      Profession
                    </Tabs.Tab>
                    <Tabs.Tab value="HeadReading" leftSection={<IconSettings style={iconStyle} />}>
                      Hearing & Reading
                    </Tabs.Tab>
                    <Tabs.Tab value="Seminars" leftSection={<IconSettings style={iconStyle} />}>
                      Seminars
                    </Tabs.Tab>
                  </Tabs.List>

                  <Tabs.Panel value="plInfo" py={20}>
                    <form>
                      <Grid py={10}>
                        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
                          <TextInput label="Name (नाम)" placeholder="Name (नाम)"/>
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
                          <TextInput label="Initiated Name" placeholder="Initiated Name"/>
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
                          <TextInput label="Email Address (ईमेल आईडी)" placeholder="Email ID (ईमेल आईडी)"/>
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
                          <TextInput label="Mobile Number (मोबाइल नंबर)" placeholder="Mobile Number (मोबाइल नंबर)"/>
                        </Grid.Col>
                      </Grid>
                      <Grid py={10}>
                        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
                          <TextInput  label="DOB (जन्म की तारीख)" placeholder="DOB (जन्म की तारीख)"/>
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
                          <Select
                            label="Educational Qualification"
                            placeholder="Educational Qualification"
                            data={['Post Graduate', 'Under Graduate', '12th', '10','Non Educated']}
                            defaultValue=""
                            clearable
                          />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
                          <Select
                              label="Marital Status"
                              placeholder="Marital Status"
                              data={['Married', 'Un-Married', 'Divorce']}
                              defaultValue=""
                              clearable
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
                          <Select
                              label="Profession व्यवसाय"
                              placeholder="Profession व्यवसाय"
                              data={['Doctor', 'Engineer', 'Carpenter']}
                              defaultValue=""
                              clearable
                            />
                        </Grid.Col>
                      </Grid>
                      <Grid py={10}>                   
                        <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                          <TextInput label="If you initiated, mention name of your spiritual master?
                              (यदि आपने दीक्षा ली है तो अपने आध्यात्मिक गुरु का नाम बताएं?)" placeholder="If you initiated, mention name of your spiritual master? (यदि आपने दीक्षा ली है तो अपने आध्यात्मिक गुरु का नाम बताएं?)"/>
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                          <TextInput mt={22} label=
                          {<>
                            Since when you are joind to ISKCON Dwarka<br/>आप ISKCON द्वारका से कब से जुड़े हुए हैं"
                            </>
                          } placeholder="Since when you are joind to ISKCON Dwarka आप ISKCON द्वारका से कब से जुड़े हुए हैं"/>
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                          <TextInput mt={40} label="Current Address" placeholder="Current Address"/>
                        </Grid.Col>
                      </Grid>
                      <Grid py={10}>
                        <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                          <TextInput label="Permanent Address" placeholder="Permanent Address"/>
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 6, lg: 2 }}>
                          <TextInput label="Pincode" placeholder="Pincode"/>
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 6, lg: 2 }}>
                          <Select
                            label="State"
                            placeholder="State"
                            data={['Delhi', 'Punjab']}
                            defaultValue=""
                            clearable
                          />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 6, lg: 2 }}>
                          <Select
                              label="District"
                              placeholder="MDistrict"
                              data={['New Delhi']}
                              defaultValue=""
                              clearable
                            />
                        </Grid.Col>
                      </Grid>
                      <Grid>
                        <Grid.Col span={12}>
                          <Group justify="center" mt="md">
                            <Button type="submit" color="green">Save</Button>
                            <Button type="button" color="orange" onClick={handleNext}>Next</Button>
                          </Group>
                        </Grid.Col>
                      </Grid>
                    </form>
                  </Tabs.Panel>

                  <Tabs.Panel value="Profession" py={20}>
                    <form>
                        <Grid py={10}>
                          <Grid.Col span={{ base: 12, md: 6, lg: 5 }}>
                            <label>Currently how many rounds do you chant <br/>(वर्तमान में आप कितनी माला जाप करते हैं)</label>
                          </Grid.Col>
                          <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
                            <TextInput placeholder="Currently how many rounds do you chant"/>
                          </Grid.Col>
                        </Grid>
                        <Grid py={10}>
                          <Grid.Col  span={{ base: 12, md: 6, lg: 5 }}>
                            <label>Since when are you chanting above rounds<br/>उपरोक्त माला का जाप कब से कर रहे हो)</label>
                          </Grid.Col>
                          <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
                            <TextInput placeholder="Since when are you chanting above rounds"/>
                          </Grid.Col>
                        </Grid>
                        <Grid py={10}>
                          <Grid.Col span={{ base: 12, md: 12, lg: 12 }}>
                            <label>Do you follow all 4 regulative principles? क्या आप सभी 4 नियामक सिद्धांतों का पालन करते हैं?)</label>
                            <Checkbox.Group withAsterisk>
                              <Group mt="xs">
                                <Checkbox value="react" label={
                                  <>
                                    No meat eating (including onion and garlic) <br/>मांस नहीं खाना (प्याज और लहसुन सहित)
                                  </>
                                } />
                                <Checkbox value="svelte" label={
                                  <>
                                    No intoxication <br/>कोई नशा नहीं
                                  </>
                                } />
                                <Checkbox value="ng" label={
                                  <>
                                    No gambling <br/> कोई जुआ नहीं
                                  </>
                                } />
                                <Checkbox value="vue" label={
                                  <>
                                    No illicit relationship <br/> कोई अवैध संबंध नहीं
                                  </>
                                } />
                              </Group>
                            </Checkbox.Group>
                          </Grid.Col>
                          <Grid.Col span={{ base: 12, md: 12, lg: 12 }}>
                            <label>Which Srila Prabhupada's books have you read - आपने श्रील प्रभुपाद की कौन सी किताबें पढ़ी हैं?</label>
                            <Checkbox.Group withAsterisk>
                              <Group mt="xs">
                                <Checkbox value=" BeyondBirthDeath" label={
                                  <>
                                    Beyond Birth and Death <br/> जन्म और मृत्यु से परे
                                  </>
                                } />
                                <Checkbox value="RajaVidya" label={
                                  <>
                                    Raja Vidya <br/> राज विद्या
                                  </>
                                } />
                                <Checkbox value="MatchlessGift" label={
                                  <>
                                    Matchless Gift <br/> अतुलनीय उपहार
                                  </>
                                } />
                                <Checkbox value="KrishnaBook" label={
                                  <>
                                    Krishna Book <br/> कृष्णा पुस्तक
                                  </>
                                } />
                                <Checkbox value="BhagvatGita" label={
                                  <>
                                    Bhagvat Gita As It Is
                                  </>
                                } />
                                <Checkbox value="SrillaPrabhupada" label={
                                  <>
                                    Srilla Prabhupada <br/> श्रीला प्रभुपाद
                                  </>
                                } />
                                <Checkbox value="SBCanto1" label={
                                  <>
                                    SB Canto 1
                                  </>
                                } />
                                <Checkbox value="TeachingOfLordChaitanya" label={
                                  <>   
                                      Teaching of Lord Chaitanya <br/> भगवान चैतन्य की शिक्षा
                                  </>
                                } />
                                <Checkbox value="NectarOfInstruction" label={
                                  <>
                                    Nectar of Instruction <br/> उपदेश का अमृत
                                  </>
                                } />
                                <Checkbox value="Isopanisad" label={
                                  <>
                                    Sri Isopanisad <br/> श्री इसोपनिषद्
                                  </>
                                } />
                                <Checkbox value="ScienceOfSelfRealization" label={
                                  <>
                                    Science of Self Realization <br/> आत्मबोध का विज्ञान
                                  </>
                                } />
                                <Checkbox value="Other" label={
                                  <>
                                    <div style={{"marginTop":"-15px"}}>
                                      Any Other
                                      <TextInput placeholder="Other Book Name"/>
                                    </div>  
                                  </>
                                } />
                                <Checkbox value="None" label={
                                  <>
                                    None
                                  </>
                                } />
                              </Group>
                            </Checkbox.Group>
                          </Grid.Col>
                        </Grid>
                        <Grid py={10}>
                          <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                            <label>
                            How much time do you spend everyday in hearing lectures? <br/>आप प्रतिदिन व्याख्यान सुनने में कितना समय व्यतीत करते हैं?</label>
                          </Grid.Col>
                          <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
                            <TextInput placeholder="How much time do you spend everyday in hearing lectures"/>
                          </Grid.Col>
                        </Grid>
                        <Grid>
                          <Grid.Col span={12}>
                            <Group justify="center" mt="md">
                              <Button type="button" color="gray" onClick={handleBack}>Back</Button>
                              <Button type="button" color="orange" onClick={handleNext}>Next</Button>
                              <Button type="submit" color="green">Save</Button>
                            </Group>
                          </Grid.Col>
                        </Grid>
                      </form>
                  </Tabs.Panel>

                  <Tabs.Panel value="HeadReading" py={20}>
                    <Grid py={10}>
                      <Grid.Col span={{ base: 12, md: 12, lg: 12 }}>
                        <label>I have memorised following prayers - मैंने निम्नलिखित प्रार्थनाएँ याद कर ली हैं?</label>
                        <Checkbox.Group withAsterisk>
                          <Group mt="xs">
                            <Checkbox value="VaishnavaPranamMantra" label={
                              <>
                                Vaishnava Pranam Mantra <br/> वैष्णव प्रणाम मंत्र
                              </>
                            } />
                            <Checkbox value="PrabhupadaPranamMantra" label={
                              <>
                                Prabhupada Pranam Mantra<br/> प्रभुपाद प्रणाम मंत्र
                              </>
                            } />
                            <Checkbox value="KrishnaPranamMantra" label={
                              <>
                                Krishna Pranam Mantra <br/> कृष्णा प्रनाम मंत्र
                              </>
                            } />
                            <Checkbox value="RadharaniPranamMantra" label={
                              <>
                                Radharani Pranam Mantra <br/> राधारानी प्रणाम मंत्र
                              </>
                            } />
                            <Checkbox value="GaurNitaiPranamMantra " label={
                              <>
                                Gaur Nitai Pranam Mantra <br/> गौर निताई प्रणाम मंत्र
                              </>
                            } />
                            <Checkbox value="JagannathBaladevaSubhadraPranamMantra" label={
                              <>
                                Jagannath Baladeva Subhadra Pranam Mantra <br/> जगन्नाथ बलदेव सुभद्रा प्रणाम मंत्र
                              </>
                            } />
                            <Checkbox value="PrasadamHonoringMantra" label={
                              <>
                                Prasadam Honoring Mantra <br/> प्रसादम सम्मान मंत्र
                              </>
                            } />
                            <Checkbox value="PrayersForOfferingBhoga " label={
                              <>   
                                  Prayers for offering bhoga <br/> भोग लगाने के लिए प्रार्थना
                              </>
                            } />
                            <Checkbox value="Tenavoided" label={
                              <>
                                Ten offences to be avoided <br/> दस अपराधों से बचना चाहिए
                              </>
                            } />
                            <Checkbox value="Sikshastakam" label={
                              <>
                                Sikshastakam <br/> सिक्शास्टैकम
                              </>
                            } />
                            <Checkbox value="GuruMaharaj" label={
                              <>
                                Guru Maharaj Pranam Mantra <br/> गुरु महाराज प्रनाम मंत्र
                              </>
                            } />
                            <Checkbox value="None" label={
                              <>
                                None
                              </>
                            } />
                          </Group>
                        </Checkbox.Group>
                      </Grid.Col>
                    </Grid>
                    <Grid py={10}>
                      <Grid.Col span={{ base: 12, md: 12, lg: 12 }}>
                        <label>Which of the following seminars have attended? - निम्नलिखित में से किस सेमिनार में भाग लिया है?</label>
                        <Checkbox.Group withAsterisk>
                          <Group mt="xs">
                            <Checkbox value="VaishnavaPranamMantra" label={
                              <>
                                Vaishnava Etiquette <br/> वैष्णव शिष्टाचार
                              </>
                            } />
                            <Checkbox value="PrabhupadaPranamMantra" label={
                              <>
                                IDC (Iskcon Disciple Course) <br/> आईडीसी (इस्कॉन शिष्य पाठ्यक्रम)
                              </>
                            } />
                            <Checkbox value="KrishnaPranamMantra" label={
                              <>
                                None of the above <br/> इनमे से कोई भी नहीं
                              </>
                            } />
                            
                          </Group>
                        </Checkbox.Group>
                      </Grid.Col>
                    </Grid>
                    <Grid py={10}>
                      <Grid.Col span={{ base: 12, md: 12, lg: 12 }}>
                        <label>Have you completed Bhakti Shastri degree? - क्या आपने भक्ति शास्त्री की डिग्री पूरी कर ली है?</label>
                        <Radio.Group py={5}>
                          <Radio value="Yes" label="Yes - हाँ" />
                          <Radio value="No" label="No - नहीं" />
                          <Radio value="Pursuing" label="Pursuing" />
                        </Radio.Group>
                      </Grid.Col>
                    </Grid>
                    <Grid>
                      <Grid.Col span={12}>
                        <Group justify="center" mt="md">
                          <Button type="button" color="gray" onClick={handleBack}>Back</Button>
                          <Button type="button" color="orange" onClick={handleNext}>Next</Button>
                          <Button type="submit" color="green">Save</Button>
                        </Group>
                      </Grid.Col>
                    </Grid>
                  </Tabs.Panel>

                  <Tabs.Panel py={20} value="Seminars">
                      <Grid py={10}>
                        <Grid.Col span={{ base: 12, md: 12, lg: 12 }}>
                          <label>Your Ashray Leader's name (आपके आश्रय नेता का नाम?) HG</label>
                          <Radio.Group py={5}>
                            <Radio value="101" label="Archit Prabhuji" />
                            <Radio value="102" label="Amala Krishna Prabhuji" />
                            <Radio value="103" label="Bali Murari Prabhuji" />
                            <Radio value="104" label="Chanchala prabhuji" />
                            <Radio value="105" label="Dayalu Govind prabhuji" />
                            <Radio value="106" label="Hari Roopa prabhuji" />
                            <Radio value="107" label="Prashant Mukund prabhuji" />
                            <Radio value="108" label="Ravi Lochan prabhuji" />
                            <Radio value="109" label="Sachipat prabhuji" />
                            <Radio value="110" label="Sarvatama Nimai prabhuji" />
                            <Radio value="111" label="Shri Sita Mataji" />
                            <Radio value="112" label="Vaishnav Priya Damodar prabhuji" />
                            <Radio value="113" label="Ved Chaitanya prabhuji" />
                            <Radio value="114" label="Lila Kant prabhuji" />
                            <Radio value="115" label={
                              <>
                                <div>
                                  Other Name<TextInput placeholder="Other Name"/>
                                </div>
                              </>
                            } />
                          </Radio.Group>
                        </Grid.Col>
                      </Grid>
                      <Grid py={10}>
                          <Grid.Col span={{ base: 12, md: 12, lg: 12 }}>
                            <label>If others, kindly share his/her name? <br/>यदि अन्य हों तो कृपया अपना नाम साझा करें?</label>
                            <TextInput placeholder="How much time do you spend everyday in hearing lecturesIf others, kindly share his/her name? (यदि अन्य हों तो कृपया अपना नाम साझा करें?)"/>
                          </Grid.Col>
                          <Grid.Col span={{ base: 12, md: 12, lg: 12 }}>
                            <label>Since when are you attending ashray classes, Month/Year? <br/>आप कब से आश्रय कक्षाओं में भाग ले रहे हैं, माह/वर्ष?</label>
                            <TextInput  placeholder="Since when are you attending ashray classes, Month/Year? (आप कब से आश्रय कक्षाओं में भाग ले रहे हैं, माह/वर्ष?)"/>
                          </Grid.Col>
                          <Grid.Col span={{ base: 12, md: 12, lg: 12 }}>
                            <label>If you are not initiated, mention name of spiritual master you are aspiring for? <br/>यदि आपने दीक्षा नहीं ली है, तो उस आध्यात्मिक गुरु का नाम बताएं जिसकी आप आकांक्षा कर रहे हैं?</label>
                            <TextInput placeholder="If you are not initiated, mention name of spiritual master you are aspiring for? (यदि आपने दीक्षा नहीं ली है, तो उस आध्यात्मिक गुरु का नाम बताएं जिसकी आप आकांक्षा कर रहे हैं?)"/>
                          </Grid.Col>
                          <Grid.Col span={{ base: 12, md: 12, lg: 12 }}>
                            <label>How regularly do you attend Ashray classes in the temple? <br/>आप मंदिर में आश्रय कक्षाओं में कितने नियमित रूप से उपस्थित होते हैं?</label>
                            <TextInput placeholder="How regularly do you attend Ashray classes in the temple? (आप मंदिर में आश्रय कक्षाओं में कितने नियमित रूप से उपस्थित होते हैं?)"/>
                          </Grid.Col>
                        </Grid>
                        <Grid>
                        <Grid.Col span={12}>
                          <Group justify="center" mt="md">
                            <Button type="button" color="gray" onClick={handleBack}>Back</Button>
                            <Button type="submit" color="green">Save</Button>
                          </Group>
                        </Grid.Col>
                      </Grid>
                  </Tabs.Panel>
                </Tabs>
              </Card>
            </Grid.Col>
          </Grid>
        </Stack>
      </Container>
    );
}
