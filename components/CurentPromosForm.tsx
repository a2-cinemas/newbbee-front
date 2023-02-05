import React from 'react';
import { Table } from 'flowbite-react';
import { HiTrash, HiPaperAirplane, HiX, HiCheck } from 'react-icons/hi';
import { gql, useQuery, useMutation } from '@apollo/client';
import { useState } from 'react';
import emailjs from 'emailjs-com';
import DeleteModal from './DeleteModal';

const GET_PROMOTIONS = gql`
  query promotion {
    promotion {
      promotionID
      title
      promoCode
      percentOff
      startDate
      endDate
      active
    }
  }
`;

const GET_USERS = gql`
  query getAllUsers {
    getAllUsers {
      email
      promotion
    }
  }
`;

const DELETE_PROMOTION = gql`
  mutation deletePromotion($promoId: Int!) {
    deletePromotionById(id: $promoId) {
      promotionID
      percentOff
      promoCode
      startDate
      endDate
    }
  }
`;

const UPDATE_PROMOTION = gql`
  mutation updatePromotion($updatePromoInput: UpdatePromotionInput!) {
    updatePromotion(updatePromotionInput: $updatePromoInput) {
      title
      active
      percentOff
      promoCode
    }
  }
`;

const CurrentPromosForm = () => {
  const tableHeaders = ['Name', 'Promo Code', 'Discount', 'Start Date', 'End Date', 'Active'];

  const [showDeleteModal, setShowDeleteModal] = useState({});

  const { loading, error, data } = useQuery(GET_PROMOTIONS);
  const { loading: loadingUsers, error: errorUsers, data: dataUsers } = useQuery(GET_USERS);
  const [deletePromotion] = useMutation(DELETE_PROMOTION);
  const [updatePromotion] = useMutation(UPDATE_PROMOTION);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :( </p>;

  const handleDelete = (id: number) => {
    deletePromotion({
      variables: {
        promoId: id,
      },
      refetchQueries: [{ query: GET_PROMOTIONS }],
    });
    setShowDeleteModal({ ...showDeleteModal, [id]: false });
  };

  const sendPromotionEmail = async (userEmail: string, percentOff: number, title: string, promoCode: string) => {
    try {
      await emailjs.send(
        'service_va70md4',
        'template_nlawgjd',
        {
          email: userEmail,
          title: `${percentOff}% OFF Promo Code`,
          head: `You received the ${title} promo code to use at your next checkout!`,
          message: `Here's your promo code:`,
          verificationToken: `${promoCode}`,
        },
        'CCk7kM0XQ4zjFYb7H'
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full space-y-4 text-center">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Current Promo Codes</h1>

      <Table>
        <Table.Head className="text-center">
          {tableHeaders.map((header) => (
            <Table.HeadCell key={header}>{header}</Table.HeadCell>
          ))}
          <Table.HeadCell>
            <span className="sr-only">Edit</span>
          </Table.HeadCell>
          <Table.HeadCell>
            <span className="sr-only">Delete</span>
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {data.promotion.map((promo: any) => (
            <>
              <Table.Row key={promo.promotionID} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell
                  className="text-left whitespace-nowrap font-medium text-gray-900 dark:text-white"
                  key={promo.title}
                >
                  {promo.title}
                </Table.Cell>
                <Table.Cell key={promo.promoCode}>{promo.promoCode}</Table.Cell>
                <Table.Cell key={promo.percentOff}>{`${promo.percentOff}%`}</Table.Cell>
                <Table.Cell key={promo.startDate}>{promo.startDate}</Table.Cell>
                <Table.Cell key={promo.endDate}>{promo.endDate}</Table.Cell>
                <Table.Cell key={promo.active} className="flex justify-center">
                  {promo.active ? (
                    <HiCheck className="w-5 h-5 text-green-400" title="Sent" />
                  ) : (
                    <HiX className="w-5 h-5 text-red-600" title="Not Sent" />
                  )}
                </Table.Cell>
                <Table.Cell>
                  <button className="text-gray-400 hover:text-gray-500">
                    <span className="sr-only">Edit</span>
                    <HiPaperAirplane
                      className="w-5 h-5"
                      aria-hidden="true"
                      title="Send Promotion"
                      onClick={() => {
                        if (!loadingUsers && !errorUsers) {
                          dataUsers.getAllUsers.map((user: any) => {
                            if (user.promotion === true) {
                              sendPromotionEmail(user.email, promo.percentOff, promo.title, promo.promoCode);
                            }
                          });
                          updatePromotion({
                            variables: {
                              updatePromoInput: {
                                promotionID: promo.promotionID,
                                active: true,
                              },
                            },
                            refetchQueries: [{ query: GET_PROMOTIONS }],
                          });
                        }
                      }}
                    />
                  </button>
                </Table.Cell>
                <Table.Cell>
                  <button className="text-gray-400 hover:text-gray-500">
                    <span className="sr-only">Delete</span>
                    <HiTrash
                      className="w-5 h-5 hover:text-red-500 dark:hover:text-red-500"
                      aria-hidden="true"
                      title="Delete Promotion"
                      onClick={() => setShowDeleteModal({ ...showDeleteModal, [promo.promotionID]: true })}
                    />
                  </button>
                </Table.Cell>
              </Table.Row>

              {showDeleteModal && (
                <DeleteModal
                  show={showDeleteModal[promo.promotionID]}
                  prompt={'Are you sure you want to delete this promo code?'}
                  onClick={() => handleDelete(promo.promotionID)}
                  onClose={() => setShowDeleteModal({ ...showDeleteModal, [promo.promotionID]: false })}
                />
              )}
            </>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};

export default CurrentPromosForm;
